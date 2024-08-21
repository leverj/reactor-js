import {BridgeNode} from '../../src/BridgeNode.js'
import {peerIdJsons} from './fixtures.js'

export const createBridgeNodes = async (howMany) => {
  const results = []
  const bootstraps = []
  for (let i = 0; i < howMany; i++) {
    const node = await BridgeNode.from({
      port: 9000 + i,
      json: {p2p: peerIdJsons[i]},
      bootstrapNodes: bootstraps,
    })
    results.push(node)
    await node.start()
    if (i === 0) bootstraps.push(node.multiaddrs[0])
  }
  return results
}

