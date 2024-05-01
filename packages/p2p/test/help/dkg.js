import {TSSNode} from '../../src/TSSNode.js'
import bls from '../../src/bls.js'
import * as mcl from '../../src/mcl/mcl.js'
import {expect} from 'expect'

export async function signAndVerify(contract, message, members) {
  const {signs, signers} = signMessage(message, members)
  const groupsSign = new bls.Signature()
  groupsSign.recover(signs, signers)
  const verified = members[0].groupPublicKey.verify(groupsSign, message)
  const contractVerified = await verifyInContract(groupsSign.serializeToHexStr(), members[0].groupPublicKey.serializeToHexStr(), message, contract)
  expect(contractVerified).toBe(verified)
  // console.log('pub key hex', members[0].groupPublicKey.serializeToHexStr())
  // console.log('signatureHex', groupsSign.serializeToHexStr())
  groupsSign.clear()
  return verified
}

async function verifyInContract(signatureHex, pubkeyHex, message, contract){
  const M = mcl.hashToPoint(message)
  const signature = mcl.deserializeHexStrToG1(signatureHex)
  const pubkey = mcl.deserializeHexStrToG2(pubkeyHex)
  let message_ser = mcl.g1ToBN(M)
  let pubkey_ser = mcl.g2ToBN(pubkey)
  let sig_ser = mcl.g1ToBN(signature)
  return  await contract.verifySignature(sig_ser, pubkey_ser, message_ser)
}

export const signMessage = (message, members) => {
  const signs = [], signers = []
  for (const member of members) {
    signs.push(member.sign(message))
    signers.push(member.id)
  }
  return {signs, signers}
}

export const setupMembers = async (members, threshold) => {
  for (const member of members) member.generateVectors(threshold)
  for (const member of members) await member.generateContribution()
  // for (const member of members) member.dkgDone()
  return members
}

export async function addMember(members, newMember) {
  for (const existing of members) {
    await existing.generateContributionForId(newMember.id.serializeToHexStr(), newMember.onMessage.bind(newMember))
    existing.addMember(newMember.id.serializeToHexStr(), newMember.onMessage.bind(newMember))
    newMember.addMember(existing.id.serializeToHexStr(), existing.onMessage.bind(existing))
  }
  newMember.addMember(newMember.id.serializeToHexStr(), newMember.onMessage.bind(newMember))
  newMember.dkgDone()
  members.push(newMember)
}

export const createDkgMembers = async (memberIds, threshold) => {
  const members = memberIds.map(id => new TSSNode(id.toString()))
  for (const member of members) for (const member1 of members) member.addMember(member1.id.serializeToHexStr(), member1.onMessage.bind(member1))
  return await setupMembers(members, threshold)
}

