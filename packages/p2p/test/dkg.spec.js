import bls from 'bls-wasm'
import {createDkgMembers, setupMembers, signMessage} from './help.js'
import {expect} from 'expect'
import {Member} from '../src/Member.js'


describe('dkg', function () {
  before(async function () {
    await bls.init()
  })
  it('should be able to create distributed keys and sign message', async function () {
    const threshold = 4
    const members = createDkgMembers([10314, 30911, 25411, 8608, 31524, 15441, 23399], threshold)
    expect(members.length).toBe(7)
    for (const member of members) {
      expect(member.groupPublicKey).toEqual(members[0].groupPublicKey)
    }
    const message = 'hello world'
    const {signs, signers} = signMessage(message, members)
    const groupsSig = new bls.Signature()
    groupsSig.recover(signs.splice(1, 4), signers.splice(1, 4))
    var verified = members[0].groupPublicKey.verify(groupsSig, message)
    expect(verified).toBe(true)
    groupsSig.clear()
  })

  it('should be able to get shared public key from verification vector', async function () {
    const members = createDkgMembers([10314, 30911, 25411, 8608, 31524, 15441, 23399], 4)
    const member = members[4]
    const pk1 = new bls.PublicKey()
    pk1.share(member.Vvec, member.id)
    const pk2 = member.secretKeyShare.getPublicKey()
    expect(pk1.isEqual(pk2)).toBe(true)
    pk1.clear()
    pk2.clear()
  })

  it('share renewal', async function () {
    const threshold = 4
    const members = createDkgMembers([10314, 30911, 25411, 8608, 31524, 15441, 23399], threshold)
    const message = 'hello world'
    const {signs, signers} = signMessage(message, members)
    const groupsSign = new bls.Signature()
    groupsSign.recover(signs, signers)
    const groupsPublicKey = members[0].groupPublicKey

    // -> member shares array reinitialized
    members.forEach(member => member.reinitiate())
    setupMembers(members, threshold)
    for (const member of members) expect(member.groupPublicKey).toEqual(groupsPublicKey)
    const {signs: newSigns, signers: newSigners} = signMessage(message, members)
    const newGroupsSign = new bls.Signature()
    newGroupsSign.recover(newSigns.splice(0, 4), newSigners.splice(0, 4))
    expect(members[0].groupPublicKey.verify(newGroupsSign, message)).toBe(true)
  })

  it('should be able to add new member', async function () {
    const threshold = 4
    const members = createDkgMembers([10314, 30911, 25411, 8608, 31524, 23399, 15441], threshold)
    const message = 'hello world'
    const groupsPublicKey = members[0].groupPublicKey
    members.forEach(member => member.reinitiate())
    let newMember = new Member(11110)
    newMember.addVvecs(members[0].Vvec)
    members.push(newMember)
    setupMembers(members, threshold)
    for (const member of members) member.print()
    console.log('-------------------', groupsPublicKey.serializeToHexStr())
    for (const member of members) expect(member.groupPublicKey.serializeToHexStr()).toEqual(groupsPublicKey.serializeToHexStr())
    const {signs: newSigns, signers: newSigners} = signMessage(message, members)
    const newGroupsSign = new bls.Signature()
    newGroupsSign.recover(newSigns.splice(4, 4), newSigners.splice(4, 4))
    expect(members[0].groupPublicKey.verify(newGroupsSign, message)).toBe(true)
  })
})
