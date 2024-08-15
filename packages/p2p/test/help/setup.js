import {BridgeNode} from '../../src/BridgeNode.js'
import {peerIdJsons} from './fixtures.js'

export const createBridgeNodes = async (howMany) => {
  const nodes = []
  const bootstraps = []
  for (let i = 0; i < howMany; i++) {
    const node = await BridgeNode.from({
      port: 9000 + i,
      isLeader: i === 0,
      json: {p2p: peerIdJsons[i]},
      bootstrapNodes: bootstraps,
    })
    await node.start()
    nodes.push(node)
    if (i === 0) bootstraps.push(node.multiaddrs[0])
  }
  return nodes
}

