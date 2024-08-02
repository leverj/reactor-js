import {
  deserializeHexStrToSignature,
  deserializeHexStrToPublicKey,
  G1ToNumbers,
  G2ToNumbers,
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
  const signature = deserializeHexStrToSignature(signatureHex)
  const pubkey = deserializeHexStrToPublicKey(pubkeyHex)
  const message_ser = G1ToNumbers(M)
  const pubkey_ser = G2ToNumbers(pubkey)
  const sig_ser = G1ToNumbers(signature)
  return await contract.verify(sig_ser, pubkey_ser, message_ser)
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

export async function addMember(members, joiner) {
  for (const each of members) {
    await each.generateContributionForId(joiner.id.serializeToHexStr(), joiner.onDkgShare.bind(joiner))
    each.addMember(joiner.id.serializeToHexStr(), joiner.onDkgShare.bind(joiner))
    joiner.addMember(each.id.serializeToHexStr(), each.onDkgShare.bind(each))
  }
  joiner.addMember(joiner.id.serializeToHexStr(), joiner.onDkgShare.bind(joiner))
  joiner.dkgDone()
  members.push(joiner)
}

export const createDkgMembers = async (memberIds, threshold = 4) => {
  const members = memberIds.map(id => new TssNode(id.toString()))
  for (const member1 of members)
    for (const member2 of members)
      member1.addMember(member2.id.serializeToHexStr(), member2.onDkgShare.bind(member2))
  return setupMembers(members, threshold)
}

