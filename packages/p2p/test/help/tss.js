import {
  deserializeHexStrToG1,
  deserializeHexStrToG2,
  g1ToBN,
  g2ToBN,
  hashToPoint,
  Signature,
} from '@leverj/reactor.mcl'
import {expect} from 'expect'
import {TssNode} from '../../src/TssNode.js'

export async function signAndVerify(contract, message, members) {
  const {signs, signers} = signMessage(message, members)
  const groupsSign = new Signature()
  groupsSign.recover(signs, signers)
  const verified = members[0].groupPublicKey.verify(groupsSign, message)
  const contractVerified = await verifyInContract(groupsSign.serializeToHexStr(), members[0].groupPublicKey.serializeToHexStr(), message, contract)
  expect(contractVerified).toBe(verified)
  groupsSign.clear()
  return verified
}

async function verifyInContract(signatureHex, pubkeyHex, message, contract) {
  const M = hashToPoint(message)
  const signature = deserializeHexStrToG1(signatureHex)
  const pubkey = deserializeHexStrToG2(pubkeyHex)
  const message_ser = g1ToBN(M)
  const pubkey_ser = g2ToBN(pubkey)
  const sig_ser = g1ToBN(signature)
  return await contract.verifySignature(sig_ser, pubkey_ser, message_ser)
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
    await existing.generateContributionForId(newMember.id.serializeToHexStr(), newMember.onDkgShare.bind(newMember))
    existing.addMember(newMember.id.serializeToHexStr(), newMember.onDkgShare.bind(newMember))
    newMember.addMember(existing.id.serializeToHexStr(), existing.onDkgShare.bind(existing))
  }
  newMember.addMember(newMember.id.serializeToHexStr(), newMember.onDkgShare.bind(newMember))
  newMember.dkgDone()
  members.push(newMember)
}

export const createDkgMembers = async (memberIds, threshold) => {
  const members = memberIds.map(id => new TssNode(id.toString()))
  for (const member of members) for (const member1 of members) member.addMember(member1.id.serializeToHexStr(), member1.onDkgShare.bind(member1))
  return await setupMembers(members, threshold)
}

