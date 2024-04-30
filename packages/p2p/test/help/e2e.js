import {peerIdJsons} from './fixtures.js'
import Bridge from '../../src/Bridge.js'

export const nodes = []
export const stopNodes = async () => {
  for (const node of nodes) await node.stop()
  nodes.length = 0
}

export const createBridgeNodes = async (count) => {
  for (let i = 0; i < count; i++) {
    // fixme: get peerid from config eventually some file
    const node = new Bridge({port: 9000 + i, isLeader: i === 0, peerIdJson: peerIdJsons[i]})
    await node.create()
    await node.start()
    nodes.push(node)
  }
  return nodes
}