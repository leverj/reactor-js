import bls from '../src/bls.js'

import {createDkgMembers, setupMembers, signMessage, signAndVerify, addMember} from './help.js'
import {expect} from 'expect'
import {Member} from '../src/Member.js'
const message = 'hello world'

describe('dkg', function () {

  it('should be able to match member pub key derived from member pvt key', async function () {
    const threshold = 4
    const members = createDkgMembers([10314, 30911, 25411, 8608, 31524, 15441, 23399], threshold)
    for (const member of members) {
      member.print()
      expect(member.publicKey.serializeToHexStr()).toEqual(member.secretKeyShare.getPublicKey().serializeToHexStr())
    }
  })


  it('should be able to create distributed keys and sign message', async function () {
    const threshold = 4
    const members = createDkgMembers([10314, 30911, 25411, 8608, 31524, 15441, 23399], threshold)
    expect(members.length).toBe(7)
    for (const member of members) {
      expect(member.groupPublicKey.serializeToHexStr()).toEqual(members[0].groupPublicKey.serializeToHexStr())
    }
    expect(signAndVerify(message, members.slice(0, 3))).toBe(false)
    expect(signAndVerify(message, members.slice(0, 4))).toBe(true)
    expect(signAndVerify(message, members.slice(0, 5))).toBe(true)
    expect(signAndVerify(message, members.slice(0, 6))).toBe(true)
    expect(signAndVerify(message, members.slice(0, 7))).toBe(true)
  })

  it('should be able to add new member retaining old public key and sign messages', async function () {
    const threshold = 4
    const members = createDkgMembers([10314, 30911, 25411, 8608, 31524, 15441, 23399], threshold)
    expect(members.length).toBe(7)
    let groupPublicKey = members[0].vvec[0]
    addMember(members, new Member(100))
    expect(members.length).toBe(8)
    for (const member of members) expect(member.groupPublicKey.serializeToHexStr()).toEqual(groupPublicKey.serializeToHexStr())
    const fixtures = [[0, 3, false], [0, 4, true], [0, 5, true], [0, 6, true], [0, 7, true], [0, 8, true],
      [2, 8, true], [3, 8, true], [4, 4, true], [5, 3, false]
    ]
    for (const [start, total, expected] of fixtures) {
      expect(signAndVerify(message, members.slice(start, start+total))).toBe(expected)
    }
  })

  it('should be able to increase threshold', async function () {
    const threshold = 4
    const members = createDkgMembers([10314, 30911, 25411, 8608, 31524, 23399, 15441, 138473], threshold)
    expect(signAndVerify(message, members.slice(0, 4))).toBe(true)
    const groupsPublicKey = members[0].groupPublicKey
    members.forEach(member => member.reinitiate())
    setupMembers(members, threshold + 1)
    for (const member of members) expect(member.groupPublicKey.serializeToHexStr()).toEqual(groupsPublicKey.serializeToHexStr())
    expect(signAndVerify(message, members.slice(0, 4))).toBe(false)
    expect(signAndVerify(message, members.slice(3, 7))).toBe(false)
    expect(signAndVerify(message, members.slice(0, 5))).toBe(true)
    expect(signAndVerify(message, members.slice(2, 7))).toBe(true)
  })

  it('should be able to add member and increase threshold without changing group public key', async function () {
    const threshold = 4
    const members = createDkgMembers([10314, 30911, 25411, 8608, 31524, 23399, 15441], threshold)
    expect(signAndVerify(message, members.slice(0, 4))).toBe(true)
    const groupsPublicKey = members[0].groupPublicKey
    addMember(members, new Member(100))
    members.forEach(member => member.reinitiate())
    setupMembers(members, threshold + 1)
    for (const member of members) expect(member.groupPublicKey.serializeToHexStr()).toEqual(groupsPublicKey.serializeToHexStr())
    expect(signAndVerify(message, members.slice(0, 4))).toBe(false)
    expect(signAndVerify(message, members.slice(4, 8))).toBe(false)
    expect(signAndVerify(message, members.slice(0, 5))).toBe(true)
    expect(signAndVerify(message, members.slice(3, 8))).toBe(true)
  })

  it('should be able to get shared public key from verification vector', async function () {
    const members = createDkgMembers([10314, 30911, 25411, 8608, 31524, 15441, 23399], 4)
    const member = members[4]
    const pk1 = new bls.PublicKey()
    pk1.share(member.vvec, member.id)
    const pk2 = member.secretKeyShare.getPublicKey()
    expect(pk1.isEqual(pk2)).toBe(true)
    pk1.clear()
    pk2.clear()
  })

  it('share renewal', async function () {
    const threshold = 4
    const members = createDkgMembers([10314, 30911, 25411, 8608, 31524, 15441, 23399], threshold)
    const {signs, signers} = signMessage(message, members)
    const groupsSign = new bls.Signature()
    groupsSign.recover(signs, signers)
    const groupsPublicKey = members[0].groupPublicKey

    // -> member shares array reinitialized
    members.forEach(member => member.reinitiate())
    setupMembers(members, threshold)
    for (const member of members) expect(member.groupPublicKey.serializeToHexStr()).toEqual(groupsPublicKey.serializeToHexStr())
    const {signs: newSigns, signers: newSigners} = signMessage(message, members)
    const newGroupsSign = new bls.Signature()
    newGroupsSign.recover(newSigns.slice(0, 4), newSigners.slice(0, 4))
    expect(members[0].groupPublicKey.verify(newGroupsSign, message)).toBe(true)
  })


  it('should be able to remove a member', async function () {
    const threshold = 4
    const members = createDkgMembers([10314, 30911, 25411, 8608, 31524, 23399, 15441, 138473], threshold)
    const groupsPublicKey = members[0].groupPublicKey
    members.forEach(member => member.reinitiate())
    members.pop()
    setupMembers(members, threshold)
    for (const member of members) expect(member.groupPublicKey.serializeToHexStr()).toEqual(groupsPublicKey.serializeToHexStr())
    expect(signAndVerify(message, members.slice(0, 3))).toBe(false)
    expect(signAndVerify(message, members.slice(0, 4))).toBe(true)
    expect(signAndVerify(message, members.slice(0, 5))).toBe(true)
    expect(signAndVerify(message, members.slice(3, 7))).toBe(true)
    expect(signAndVerify(message, members.slice(4, 7))).toBe(false)
  })

  it.skip('should be able to decrease threshold', async function () {
    const threshold = 5
    const members = createDkgMembers([10314, 30911, 25411, 8608, 31524, 23399, 15441, 138473], threshold)
    expect(signAndVerify(message, members.slice(0, 4))).toBe(false)
    expect(signAndVerify(message, members.slice(0, 5))).toBe(true)
    const groupsPublicKey = members[0].groupPublicKey
    members.forEach(member => member.reinitiate())
    setupMembers(members, threshold - 1)
    for (const member of members) expect(member.groupPublicKey.serializeToHexStr()).toEqual(groupsPublicKey.serializeToHexStr())
    expect(signAndVerify(message, members.slice(0, 3))).toBe(false)
    //fixme: test fails here
    expect(signAndVerify(message, members.slice(0, 4))).toBe(true)
    expect(signAndVerify(message, members.slice(0, 5))).toBe(true)
  })
})
