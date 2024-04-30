import Node from '../../src/Node.js'
import {peerIdJsons} from './fixtures.js'

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