import {logger} from '@leverj/common/utils'
import {BnsVerifier} from '@leverj/reactor.chain/test'
import {
  deserializeHexStrToPublicKey,
  deserializeHexStrToSignature,
  G1ToNumbers,
  G2ToNumbers,
  hashToPoint,
  PublicKey,
  Signature,
} from '@leverj/reactor.mcl'
import {expect} from 'expect'
import {TssNode} from '../src/TssNode.js'
import {createDkgMembers, setupMembers, signMessage} from './help/index.js'

//fixme: is this a TssNode.spec ?
describe('dkg', () => {
  const message = 'hello world'
  const memberIds = [10314, 30911, 25411, 8608, 31524, 15441, 23399]
  let verifier

  before(async () => verifier = await BnsVerifier())

  const signAndVerify = async (members) => {
    const leader = members[0]
    const {signs, signers} = signMessage(message, members)
    const signature = new Signature()
    signature.recover(signs, signers)
    const verified = leader.groupPublicKey.verify(signature, message)
    signature.clear()
    return verified
  }

  const addMember = async (members, joiner) => {
    for (const each of members) {
      await each.generateContributionForId(joiner.id.serializeToHexStr(), joiner.onDkgShare.bind(joiner))
      each.addMember(joiner.id.serializeToHexStr(), joiner.onDkgShare.bind(joiner))
      joiner.addMember(each.id.serializeToHexStr(), each.onDkgShare.bind(each))
    }
    joiner.addMember(joiner.id.serializeToHexStr(), joiner.onDkgShare.bind(joiner))
    joiner.dkgDone()
    members.push(joiner)
  }

  it('should be able to match member pub key derived from member pvt key', async () => {
    const members = await createDkgMembers(memberIds)
    for (const each of members) {
      expect(each.publicKey.serializeToHexStr()).toEqual(each.secretKeyShare.getPublicKey().serializeToHexStr())
    }
  })

  it('signAndVerify', async () => {
    const verifiedInContract = async (members) => {
      const leader = members[0]
      const {signs, signers} = signMessage(message, members)
      const signature = new Signature()
      signature.recover(signs, signers)
      return verifier.verify(
        G1ToNumbers(deserializeHexStrToSignature(signature.serializeToHexStr())),
        G2ToNumbers(deserializeHexStrToPublicKey(leader.groupPublicKey.serializeToHexStr())),
        G1ToNumbers(hashToPoint(message)),
      )
    }

    const members = await createDkgMembers(memberIds)
    expect(await signAndVerify(members.slice(0, 3))).toBe(false)
    expect(await signAndVerify(members.slice(0, 3))).toBe(await verifiedInContract(members.slice(0, 3)))
    expect(await signAndVerify(members)).toBe(true)
    expect(await signAndVerify(members)).toBe(await verifiedInContract(members))
  })

  it('should be able to create distributed keys and sign message', async () => {
    const members = await createDkgMembers(memberIds)
    const leader = members[0]
    for (const each of members) {
      expect(each.groupPublicKey.serializeToHexStr()).toEqual(leader.groupPublicKey.serializeToHexStr())
    }
    expect(await signAndVerify(members.slice(0, 3))).toBe(false)
    expect(await signAndVerify(members.slice(0, 4))).toBe(true)
    expect(await signAndVerify(members.slice(0, 5))).toBe(true)
    expect(await signAndVerify(members.slice(0, 6))).toBe(true)
    expect(await signAndVerify(members.slice(0, 7))).toBe(true)
  })

  it('should be able to add new member retaining old public key and sign messages', async () => {
    const members = await createDkgMembers(memberIds)
    const groupPublicKeyHex = members[0].vvec[0].serializeToHexStr()
    await addMember(members, new TssNode('100'))
    expect(members.length).toBe(8)
    for (const member of members) expect(member.groupPublicKey.serializeToHexStr()).toEqual(groupPublicKeyHex)

    for (const [start, total, expected] of [
      [0, 3, false],
      [0, 4, true],
      [0, 5, true],
      [0, 6, true],
      [0, 7, true],
      [0, 8, true],
      [2, 8, true],
      [3, 8, true],
      [4, 4, true],
      [5, 3, false],
    ]) {
      expect(await signAndVerify(members.slice(start, start + total))).toBe(expected)
    }
  })

  it('should be able to increase threshold', async () => {
    const threshold = 4
    const members = await createDkgMembers(memberIds, threshold)
    expect(await signAndVerify(members.slice(0, 4))).toBe(true)

    const groupsPublicKeyHex = members[0].groupPublicKey.serializeToHexStr()
    members.forEach(member => member.reinitiate())
    await setupMembers(members, threshold + 1)
    for (const member of members) expect(member.groupPublicKey.serializeToHexStr()).toEqual(groupsPublicKeyHex)
    expect(await signAndVerify(members.slice(0, 4))).toBe(false)
    expect(await signAndVerify(members.slice(3, 7))).toBe(false)
    expect(await signAndVerify(members.slice(0, 5))).toBe(true)
    expect(await signAndVerify(members.slice(2, 7))).toBe(true)
  })

  it('should be able to add member and increase threshold without changing group public key', async () => {
    const threshold = 4
    const members = await createDkgMembers(memberIds.slice(0, memberIds.length), threshold)
    expect(await signAndVerify(members.slice(0, 4))).toBe(true)

    const groupsPublicKey = members[0].groupPublicKey
    await addMember(members, new TssNode('100'))
    members.forEach(member => member.reinitiate())
    await setupMembers(members, threshold + 1)
    for (const member of members) expect(member.groupPublicKey.serializeToHexStr()).toEqual(groupsPublicKey.serializeToHexStr())
    expect(await signAndVerify(members.slice(0, 4))).toBe(false)
    expect(await signAndVerify(members.slice(4, 8))).toBe(false)
    expect(await signAndVerify(members.slice(0, 5))).toBe(true)
    expect(await signAndVerify(members.slice(3, 8))).toBe(true)
  })

  it('should be able to get shared public key from verification vector', async () => {
    const members = await createDkgMembers(memberIds, 4)
    const member = members[4]
    const pk1 = new PublicKey()
    pk1.share(member.vvec, member.id)
    const pk2 = member.secretKeyShare.getPublicKey()
    expect(pk1.isEqual(pk2)).toBe(true)
    pk1.clear()
    pk2.clear()
  })

  it('share renewal', async () => {
    const threshold = 4
    const members = await createDkgMembers(memberIds, threshold)
    const {signs, signers} = signMessage(message, members)
    const groupsSign = new Signature()
    groupsSign.recover(signs, signers)
    const groupsPublicKey = members[0].groupPublicKey
    // -> member shares array reinitialized
    members.forEach(member => member.reinitiate())
    await setupMembers(members, threshold)
    for (const member of members) expect(member.groupPublicKey.serializeToHexStr()).toEqual(groupsPublicKey.serializeToHexStr())
    const {signs: newSigns, signers: newSigners} = signMessage(message, members)
    const newGroupsSign = new Signature()
    newGroupsSign.recover(newSigns.slice(0, 4), newSigners.slice(0, 4))
    expect(members[0].groupPublicKey.verify(newGroupsSign, message)).toBe(true)
  })


  it('should be able to remove a member', async () => {
    const threshold = 4
    const members = await createDkgMembers(memberIds.concat(138473), threshold)
    const groupsPublicKey = members[0].groupPublicKey
    members.forEach(member => member.reinitiate())
    members.pop()
    await setupMembers(members, threshold)
    for (const member of members) expect(member.groupPublicKey.serializeToHexStr()).toEqual(groupsPublicKey.serializeToHexStr())
    expect(await signAndVerify(members.slice(0, 3))).toBe(false)
    expect(await signAndVerify(members.slice(0, 4))).toBe(true)
    expect(await signAndVerify(members.slice(0, 5))).toBe(true)
    expect(await signAndVerify(members.slice(3, 7))).toBe(true)
    expect(await signAndVerify(members.slice(4, 7))).toBe(false)
  })

  it.skip('should be able to decrease threshold', async () => {
    const threshold = 5
    const members = await createDkgMembers(memberIds, threshold)
    expect(await signAndVerify(members.slice(0, 4))).toBe(false)
    expect(await signAndVerify(members.slice(0, 5))).toBe(true)

    const groupsPublicKey = members[0].groupPublicKey
    members.forEach(member => member.reinitiate())
    await setupMembers(members, threshold - 1)
    for (const member of members) expect(member.groupPublicKey.serializeToHexStr()).toEqual(groupsPublicKey.serializeToHexStr())
    expect(await signAndVerify(members.slice(0, 3))).toBe(false)
    //fixme: test fails here
    expect(await signAndVerify(members.slice(0, 4))).toBe(true)
    expect(await signAndVerify(members.slice(0, 5))).toBe(true)
  })

  it.skip('measurement matrix: takes a lot of time.', async () => {
    const times = []
    for (let length = 10; length <= 200; length = length + 10) {
      const threshold = Math.floor(length / 2) + 1
      const time = {length, threshold, dkg: Date.now()}
      const members = await createDkgMembers(Array(length).fill(0).map((_, i) => 10000 + i), threshold)
      time.dkg = (Date.now() - time.dkg) / 1000 + 's'
      time.sign = Date.now()
      const {signs, signers} = signMessage('hello world', members.slice(0, threshold))
      const groupsSign = new Signature()
      groupsSign.recover(signs, signers)
      time.sign = (Date.now() - time.sign) / 1000 + 's'
      logger.log('length', length, 'threshold', threshold, 'dkg', time.dkg, 'sign', time.sign)
      times.push(time)
    }
    logger.table(times)
  })
})
