import {gossipsub} from '@chainsafe/libp2p-gossipsub'
import {noise} from '@chainsafe/libp2p-noise'
import {yamux} from '@chainsafe/libp2p-yamux'
import {seconds} from '@leverj/lever.common'
import {bootstrap} from '@libp2p/bootstrap'
import {identify} from '@libp2p/identify'
import {kadDHT, passthroughMapper} from '@libp2p/kad-dht'
import {createFromJSON} from '@libp2p/peer-id-factory'
import {ping} from '@libp2p/ping'
import {tcp} from '@libp2p/tcp'
import {createLibp2p} from 'libp2p'

//Return true to block, false to allow the incoming to join network
//FIXME - how do we want to control ? IP seems most logical choice, since peerID and ports can be generated at will.
const gater = (address) => {
  const ipsToBlock = [] //The blocklist can come from config
  const index = ipsToBlock.findIndex(_ => address.indexOf(_) > -1)
  return index > -1
}

export const P2P = async (peerIdJson, ip, port, externalIp, bootstrapNodes) => createLibp2p({
  peerId: peerIdJson ? await createFromJSON(peerIdJson) : undefined,
  addresses: {
    listen: [`/ip4/${ip}/tcp/${port}`],
    announce: [`/ip4/${externalIp}/tcp/${port}`],
  },
  connectionGater: {
    denyInboundConnection: _ => gater(_.remoteAddr.toString()),
  },
  transports: [tcp()],
  connectionEncryption: [noise()],
  streamMuxers: [yamux()],
  connectionManager: {inboundConnectionThreshold: 100 /*Default is 5*/},
  services: {
    ping: ping({protocolPrefix: 'autonat'}),
    pubsub: gossipsub(),
    identify: identify(),
    dht: kadDHT({protocol: '/libp2p/autonat/1.0.0', peerInfoMapper: passthroughMapper, clientMode: false}),
    // nat: autoNAT({
    //   protocolPrefix: 'autonat', // this should be left as the default value to ensure maximum compatibility
    //   timeout: 30000, // the remote must complete the AutoNAT protocol within this timeout
    //   maxInboundStreams: 1, // how many concurrent inbound AutoNAT protocols streams to allow on each connection
    //   maxOutboundStreams: 1 // how many concurrent outbound AutoNAT protocols streams to allow on each connection
    // })
  },
  peerDiscovery: bootstrapNodes.length ?
    [bootstrap({autoDial: true, interval: 60 * seconds, enabled: true, list: bootstrapNodes})] :
    undefined,
})
