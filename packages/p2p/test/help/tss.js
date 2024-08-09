import {expect} from 'expect'
import {TssNode} from '../../src/TssNode.js'

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

export const createDkgMembers = async (memberIds, threshold = 4) => {
  const members = memberIds.map(id => new TssNode(id.toString()))
  for (const member1 of members)
    for (const member2 of members)
      member1.addMember(member2.id.serializeToHexStr(), member2.onDkgShare.bind(member2)) //fixme: why do we need this bind() ?
  await setupMembers(members, threshold)
  expect(members.length).toBe(memberIds.length)
  return members
}

