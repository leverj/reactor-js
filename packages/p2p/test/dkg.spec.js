import bls from 'bls-wasm'
import {createDkgMembers, setupMembers, signMessage, signAndVerify} from './help.js'
import {expect} from 'expect'
import {Member} from '../src/Member.js'



describe('dkg', function () {
  before(async function () {
    await bls.init(bls.ethMode)
  })

  it('should be able to match member pub key derived from member pvt key', async function () {
    const threshold = 4
    const members = createDkgMembers([10314, 30911, 25411, 8608, 31524, 15441, 23399], threshold)
    for (const member of members) {
      expect(member.getPublicKey().serializeToHexStr()).toEqual(member.secretKeyShare.getPublicKey().serializeToHexStr())
    }
  })

  it('should be able to create distributed keys and sign message', async function () {
    const threshold = 4
    const members = createDkgMembers([10314, 30911, 25411, 8608, 31524, 15441, 23399], threshold)
    expect(members.length).toBe(7)
    for (const member of members) {
      expect(member.groupPublicKey).toEqual(members[0].groupPublicKey)
    }
    const message = 'hello world'
    expect(signAndVerify(message, members, 0, 3)).toBe(false)
    expect(signAndVerify(message, members, 0, 4)).toBe(true)
    expect(signAndVerify(message, members, 0, 5)).toBe(true)
    expect(signAndVerify(message, members, 0, 6)).toBe(true)
    expect(signAndVerify(message, members, 0, 7)).toBe(true)
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
    // newMember.addVvecs(members[0].Vvec)
    members.push(newMember)
    setupMembers(members, threshold)
    for (const member of members) member.print()
    console.log('-------------------', groupsPublicKey.serializeToHexStr())
    for (const member of members) expect(member.groupPublicKey.serializeToHexStr()).toEqual(groupsPublicKey.serializeToHexStr())
    const {signs: newSigns, signers: newSigners} = signMessage(message, members)
    const newGroupsSign = new bls.Signature()
    newGroupsSign.recover(newSigns.splice(0, 4), newSigners.splice(4, 4))
    //fixme: test fails here
    expect(members[0].groupPublicKey.verify(newGroupsSign, message)).toBe(true)
  })

  it('should be able to remove a member', async function () {
    const threshold = 4
    const members = createDkgMembers([10314, 30911, 25411, 8608, 31524, 23399, 15441, 138473], threshold)
    const message = 'hello world'
    const groupsPublicKey = members[0].groupPublicKey
    members.forEach(member => member.reinitiate())
    members.pop()
    setupMembers(members, threshold)
    for (const member of members) expect(member.groupPublicKey.serializeToHexStr()).toEqual(groupsPublicKey.serializeToHexStr())
    expect(signAndVerify(message, members, 0, 3)).toBe(false)
    expect(signAndVerify(message, members, 0, 4)).toBe(true)
    expect(signAndVerify(message, members, 0, 5)).toBe(true)
    expect(signAndVerify(message, members, 3, 6)).toBe(true)
    expect(signAndVerify(message, members, 4, 6)).toBe(false)
  })

  it('should be able to increase threshold', async function () {
    const threshold = 4
    const message = 'hello world'
    const members = createDkgMembers([10314, 30911, 25411, 8608, 31524, 23399, 15441, 138473], threshold)
    expect(signAndVerify(message, members, 0, 4)).toBe(true)
    const groupsPublicKey = members[0].groupPublicKey
    members.forEach(member => member.reinitiate())
    setupMembers(members, threshold + 1)
    for (const member of members) expect(member.groupPublicKey.serializeToHexStr()).toEqual(groupsPublicKey.serializeToHexStr())
    expect(signAndVerify(message, members, 0, 4)).toBe(false)
    expect(signAndVerify(message, members, 0, 5)).toBe(true)
  })

  it('should be able to decrease threshold', async function () {
    const threshold = 5
    const message = 'hello world'
    const members = createDkgMembers([10314, 30911, 25411, 8608, 31524, 23399, 15441, 138473], threshold)
    expect(signAndVerify(message, members, 0, 4)).toBe(false)
    expect(signAndVerify(message, members, 0, 5)).toBe(true)
    const groupsPublicKey = members[0].groupPublicKey
    members.forEach(member => member.reinitiate())
    setupMembers(members, threshold - 1)
    for (const member of members) expect(member.groupPublicKey.serializeToHexStr()).toEqual(groupsPublicKey.serializeToHexStr())
    expect(signAndVerify(message, members, 0, 3)).toBe(false)
    //fixme: test fails here
    expect(signAndVerify(message, members, 0, 4)).toBe(true)
    expect(signAndVerify(message, members, 0, 5)).toBe(true)
  })
})
