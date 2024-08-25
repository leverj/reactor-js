import {evm} from '@leverj/reactor.chain/test'
import {TrackerMarker} from '@leverj/reactor.chain/tracking'
import config from 'config'
import {BridgeNode} from '../../src/BridgeNode.js'
import {KeyvJsonStore} from '../../src/utils/index.js'
import {peerIdJsons} from './fixtures.js'

const {bridgeNode: {confDir, port}} = config

export const marker = TrackerMarker.of(new KeyvJsonStore(confDir, 'TrackerMarker'), evm.chainId)

export const createBridgeNodes = async (howMany) => {
  const results = []
  const bootstrapNodes = []
  for (let i = 0; i < howMany; i++) {
    const data = {p2p: peerIdJsons[i]}
    const node = await BridgeNode.from(port + i, bootstrapNodes, data)
    results.push(node)
    await node.start()
    if (i === 0) bootstrapNodes.push(node.multiaddrs[0])
  }
  return results
}
