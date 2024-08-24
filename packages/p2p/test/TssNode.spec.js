import {logger} from '@leverj/common/utils'
import {BnsVerifier} from '@leverj/reactor.chain/test'
import {
  deserializeHexStrToPublicKey,
  deserializeHexStrToSignature,
  G1ToNumbers,
  G2ToNumbers,
  PublicKey,
  Signature,
} from '@leverj/reactor.mcl'
import {expect} from 'expect'
import {AbiCoder, keccak256} from 'ethers'
import {TssNode} from '../src/TssNode.js'

describe('TssNode', () => {
  const message = 'hello world'
  const memberIds = [10314, 30911, 25411, 8608, 31524, 15441, 23399]

  const signMessage = (members) => [
    members.map(_ => _.sign(message)),
    members.map(_ => _.id),
  ]

  const signAndVerify = async (members) => {
    const signature = new Signature().recover(...signMessage(members))
    return members[0].groupPublicKey.verify(signature, message)
  }

  const addMember = async (members, joiner) => {
    for (let each of members) {
      await each.generateContributionForId(joiner.idHex, joiner.onDkgShare.bind(joiner))
      each.addMember(joiner.idHex, joiner.onDkgShare.bind(joiner))
      joiner.addMember(each.idHex, each.onDkgShare.bind(each))
    }
    joiner.addMember(joiner.idHex, joiner.onDkgShare.bind(joiner))
    joiner.dkgDone()
    members.push(joiner)
  }

  const setupMembersThreshold = async (members, threshold) => {
    for (let each of members) await each.generateVectorsAndContribution(threshold)
  }

  const createDkgMembers = async (memberIds, threshold = 4) => {
    const members = memberIds.map(id => new TssNode(id.toString()))
    for (let member1 of members)
      for (let member2 of members)
        member1.addMember(member2.idHex, member2.onDkgShare.bind(member2))
    await setupMembersThreshold(members, threshold)
    expect(members.length).toBe(memberIds.length)
    return members
  }

  it('should be able to match member pub key derived from member pvt key', async () => {
    for (let each of await createDkgMembers(memberIds)) {
      expect(each.publicKey.serializeToHexStr()).toEqual(each.secretKeyShare.getPublicKey().serializeToHexStr())
    }
  })

  it('signAndVerify', async () => {
    const verifyInContract = async (members) => {
      const signature = new Signature().recover(...signMessage(members))
      const verifier = await BnsVerifier()
      return verifier.verify(
        G1ToNumbers(deserializeHexStrToSignature(signature.serializeToHexStr())),
        G2ToNumbers(deserializeHexStrToPublicKey(members[0].groupPublicKey.serializeToHexStr())),
        keccak256(AbiCoder.defaultAbiCoder().encode(['string'], [message])),
      )
    }

    const members = await createDkgMembers(memberIds)
    expect(await signAndVerify(members.slice(0, 3))).toBe(false)
    await expect(() => verifyInContract(members.slice(0, 3))).rejects.toThrow(/'Invalid Signature/)

    expect(await signAndVerify(members)).toBe(true)
    await expect(() => verifyInContract(members)).not.toThrow()
  })

  it('should be able to create distributed keys and sign message', async () => {
    const members = await createDkgMembers(memberIds)
    members.forEach(_ => expect(_.groupPublicKey.serializeToHexStr()).toEqual(members[0].groupPublicKey.serializeToHexStr()))
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
    members.forEach(_ => expect(_.groupPublicKey.serializeToHexStr()).toEqual(groupPublicKeyHex))
    for (let [start, total, expected] of [
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
    ]) expect(await signAndVerify(members.slice(start, start + total))).toBe(expected)
  })

  it('should be able to increase threshold', async () => {
    const threshold = 4
    const members = await createDkgMembers(memberIds, threshold)
    expect(await signAndVerify(members.slice(0, 4))).toBe(true)

    const groupsPublicKeyHex = members[0].groupPublicKey.serializeToHexStr()
    members.forEach(_ => _.reinitiate())
    await setupMembersThreshold(members, threshold + 1)
    members.forEach(_ => expect(_.groupPublicKey.serializeToHexStr()).toEqual(groupsPublicKeyHex))
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
    members.forEach(_ => _.reinitiate())
    await setupMembersThreshold(members, threshold + 1)
    members.forEach(_ => expect(_.groupPublicKey.serializeToHexStr()).toEqual(groupsPublicKey.serializeToHexStr()))
    expect(await signAndVerify(members.slice(0, 4))).toBe(false)
    expect(await signAndVerify(members.slice(4, 8))).toBe(false)
    expect(await signAndVerify(members.slice(0, 5))).toBe(true)
    expect(await signAndVerify(members.slice(3, 8))).toBe(true)
  })

  it('should be able to get shared public key from verification vector', async () => {
    const members = await createDkgMembers(memberIds, 4)
    const member = members[4]
    const pk1 = new PublicKey().share(member.vvec, member.id)
    const pk2 = member.secretKeyShare.getPublicKey()
    expect(pk1.isEqual(pk2)).toBe(true)
    pk1.clear()
    pk2.clear()
  })

  it('share renewal', async () => {
    const threshold = 4
    const members = await createDkgMembers(memberIds, threshold)
    // const groupsSign = new Signature().recover(...signMessage(members))
    const groupsPublicKey = members[0].groupPublicKey
    // -> member shares array reinitialized
    members.forEach(_ => _.reinitiate())
    await setupMembersThreshold(members, threshold)
    members.forEach(_ => expect(_.groupPublicKey.serializeToHexStr()).toEqual(groupsPublicKey.serializeToHexStr()))
    const [newSignatures, newSigners] = signMessage(members)
    const newGroupsSign = new Signature().recover(newSignatures.slice(0, 4), newSigners.slice(0, 4))
    expect(members[0].groupPublicKey.verify(newGroupsSign, message)).toBe(true)
  })

  it('should be able to remove a member', async () => {
    const threshold = 4
    const members = await createDkgMembers(memberIds.concat(138473), threshold)
    const groupsPublicKey = members[0].groupPublicKey
    members.forEach(_ => _.reinitiate())
    members.pop()
    await setupMembersThreshold(members, threshold)
    members.forEach(_ => expect(_.groupPublicKey.serializeToHexStr()).toEqual(groupsPublicKey.serializeToHexStr()))
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
    members.forEach(_ => _.reinitiate())
    await setupMembersThreshold(members, threshold - 1)
    members.forEach(_ => expect(_.groupPublicKey.serializeToHexStr()).toEqual(groupsPublicKey.serializeToHexStr()))
    expect(await signAndVerify(members.slice(0, 3))).toBe(false)
    //fixme: test fails here
    expect(await signAndVerify(members.slice(0, 4))).toBe(true)
    expect(await signAndVerify(members.slice(0, 5))).toBe(true)
  })

  //note: for capacity measurements
  it.skip('measurement matrix: takes a lot of time.', async () => {
    const times = []
    for (let length = 10; length <= 200; length = length + 10) {
      const threshold = Math.floor(length / 2) + 1
      const time = {length, threshold, dkg: Date.now()}
      const members = await createDkgMembers(Array(length).fill(0).map((_, i) => 10000 + i), threshold)
      time.dkg = (Date.now() - time.dkg) / 1000 + 's'
      time.sign = Date.now()
      const [signatures, signers] = signMessage(members.slice(0, threshold))
      new Signature().recover(signatures, signers)
      time.sign = (Date.now() - time.sign) / 1000 + 's'
      logger.log('length', length, 'threshold', threshold, 'dkg', time.dkg, 'sign', time.sign)
      times.push(time)
    }
    logger.table(times)
  })
})
