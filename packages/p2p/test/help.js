import {evm} from '@leverj/reactor.chain/test'
import {TrackerMarker} from '@leverj/reactor.chain/tracking'
import {G1ToNumbers, G2ToNumbers, newKeyPair, sign} from '@leverj/reactor.mcl'
import config from 'config'
import {BridgeNode} from '../src/BridgeNode.js'
import {KeyvJsonStore} from '../src/utils/index.js'
import {peerIdJsons} from './fixtures.js'

const {bridgeNode: {confDir, port}} = config

export const signer = newKeyPair()
export const publicKey = G2ToNumbers(signer.pubkey)
export const signedBy = (message, signer) => G1ToNumbers(sign(message, signer.secret).signature)

export const newTrackerMarker = (chainId) => TrackerMarker.of(new KeyvJsonStore(confDir, 'TrackerMarker'), chainId)

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
