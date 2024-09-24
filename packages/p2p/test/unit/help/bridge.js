import {BridgeNode} from '@leverj/reactor.p2p'
import config from '@leverj/reactor.p2p/config'
import {peerIdJsons} from '../../fixtures.js'

export const createBridgeNodes = async (howMany) => {
  const results = []
  const bootstrapNodes = []
  for (let i = 0; i < howMany; i++) {
    const data = {p2p: peerIdJsons[i]}
    const node = await BridgeNode.from(config, config.bridge.port + i, bootstrapNodes, data)
    await node.start()
    if (i === 0) bootstrapNodes.push(node.multiaddrs[0])
    results.push(node)
  }
  return results
}
