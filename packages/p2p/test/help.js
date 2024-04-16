import Node from '../src/Node.js'
import {Member} from '../src/Member.js'
import bls from 'bls-wasm'

let nodes = []
//const memberVectorSecretMap = {}
export const stopNodes = async () => {
  for (const node of nodes) await node.stop()
  nodes = []
}
export const startNodes = async (count, connectToLeader = false) => {
  for (let i = 0; i < count; i++) {
    const node = await new Node({port: 9000 + i, isLeader: i === 0, peerIdJson: peerIdJsons[i]}).create().then(_ => _.start()).then(_ => {
      nodes.push(_)
      return _
    })
    if (connectToLeader && i > 0) await node.connect(nodes[0].multiaddrs[0])
  }
  return nodes
}

export function signAndVerify(message, members, start, total) {
  const {signs, signers} = signMessage(message, members)
  const groupsSign = new bls.Signature()
  groupsSign.recover(signs.splice(start, total), signers.splice(start, total))
  const verified = members[0].groupPublicKey.verify(groupsSign, message)
  groupsSign.clear()
  return verified
}

export const signMessage = (message, members) => {
  const signs = [], signers = []
  for (const member of members) {
    signs.push(member.sign(message))
    signers.push(member.id)
  }
  return {signs, signers}
}
/*export const getMemberContribution = (id) => {
  return memberVectorSecretMap[id]
}*/
export const setupMembers = (members, threshold) => {
  for (const member of members) {
    const {verificationVector, secretKeyContribution, svec} = member.generateContribution(bls, members.map(m => m.id), threshold)
    member.verificationVector = verificationVector
    member.svec = svec
    //memberVectorSecretMap[member.id] = {verificationVector, secretKeyContribution}
    for (let i = 0; i < secretKeyContribution.length; i++) {
      members[i].verifyAndAndAddShare(secretKeyContribution[i], verificationVector)
      members[i].addVvecs(verificationVector)
    }
  }
  for (const member of members) member.dkgDone()
  return members
}

export const createDkgMembers = (memberIds, threshold) => {
  const members = memberIds.map(id => new Member(id))
  return setupMembers(members, threshold)
}

export const peerIdJsons = [
  {
    privKey: 'CAESQK0/fGhAG26fRXLTxDyV7LpSreIfOXSJ+krI+BdTbeJq5/UphgwH8/mDsTa9HebrBuDJ6EtxNwnEAjEVyA/OQjU',
    pubKey: 'CAESIOf1KYYMB/P5g7E2vR3m6wbgyehLcTcJxAIxFcgPzkI1',
    id: '12D3KooWRRqAo5f41sQmc9BpsfqarZgd7PWUiX14Mz1htXDEc7Gp'
  },
  {
    privKey: 'CAESQGOEED1xY75lT0dqKQ1py7iYryEd1OB+l+6Co1XvUYgVV/OuL7KfE2VGxFOxmbkOyjcVdGp3otRdTnKXWvF4OBc',
    pubKey: 'CAESIFfzri+ynxNlRsRTsZm5Dso3FXRqd6LUXU5yl1rxeDgX',
    id: '12D3KooWFjh9hF2Hnj5ctFDxhz2N2zFin3Wc3P9umGWogMycKme6'
  },
  {
    privKey: 'CAESQHOTa7HhPhxUrvmHmh5LX7jbz+CKW0ou7y39sGp45cw7pYUGS7JDh8RGeWhR8URX7UqV444+Uxk/swNGSAUkNto',
    pubKey: 'CAESIKWFBkuyQ4fERnloUfFEV+1KleOOPlMZP7MDRkgFJDba',
    id: '12D3KooWLxV5yTWvS2TbgukqBRQLvWSvSrtrciw3TQBuvhJwieMw'
  },
  {
    privKey: 'CAESQFXP6qXikupDds5pFMFpqHMcB3d0O3JZ96Kvu21w8GzZtxZ0sAfRFUUN9L9Jb1tQpkPeg/OJML+hdZtQt7h3ddk',
    pubKey: 'CAESILcWdLAH0RVFDfS/SW9bUKZD3oPziTC/oXWbULe4d3XZ',
    id: '12D3KooWN94dvv9FVczTcrCf5PfM9RxRYaY7k1UYvRzq3W8gmZ7E'
  }
]