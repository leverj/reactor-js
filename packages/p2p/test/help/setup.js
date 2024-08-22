import {BridgeNode} from '../../src/BridgeNode.js'
import {peerIdJsons} from './fixtures.js'

export const createBridgeNodes = async (howMany) => {
  const results = []
  const bootstrapNodes = []
  for (let i = 0; i < howMany; i++) {
    const data = {p2p: peerIdJsons[i]}
    const port = 9000 + i
    const node = await BridgeNode.from(port, bootstrapNodes, data)
    results.push(node)
    await node.start()
    if (i === 0) bootstrapNodes.push(node.multiaddrs[0])
  }
  return results
}

