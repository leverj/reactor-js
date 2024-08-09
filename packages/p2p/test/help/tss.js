import {
  deserializeHexStrToPublicKey,
  deserializeHexStrToSignature,
  G1ToNumbers,
  G2ToNumbers,
  hashToPoint,
  Signature,
} from '@leverj/reactor.mcl'
import {expect} from 'expect'
import {TssNode} from '../../src/TssNode.js'

export async function signAndVerify(verifier, message, members) {
  const leader = members[0]
  const {signs, signers} = signMessage(message, members)
  const signature = new Signature()
  signature.recover(signs, signers)
  const verified = leader.groupPublicKey.verify(signature, message)
  const verifiedInContract = await verifier.verify(
    G1ToNumbers(deserializeHexStrToSignature(signature.serializeToHexStr())),
    G2ToNumbers(deserializeHexStrToPublicKey(leader.groupPublicKey.serializeToHexStr())),
    G1ToNumbers(hashToPoint(message))
  )
  //fixme: this should be tested once, separately from this method
  expect(verifiedInContract).toBe(verified)
  signature.clear()
  return verified
}

export const signMessage = (message, members) => {
  const signs = [], signers = []
  for (const each of members) {
    signs.push(each.sign(message))
    signers.push(each.id)
  }
  return {signs, signers}
  //fixme: maybe a better implementation is:
  // return members.map(_ => ({id: _.id, signature: _.sign(message)}))
}

export const setupMembers = async (members, threshold) => {
  for (const each of members) each.generateVectors(threshold)
  for (const each of members) await each.generateContribution()
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
      member1.addMember(member2.id.serializeToHexStr(), member2.onDkgShare.bind(member2)) //fixme: why do we need this bind() ?
  await setupMembers(members, threshold)
  expect(members.length).toBe(memberIds.length)
  return members
}

