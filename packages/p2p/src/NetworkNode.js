import config from 'config'
import map from 'it-map'
import {gossipsub} from '@chainsafe/libp2p-gossipsub'
import {noise} from '@chainsafe/libp2p-noise'
import {yamux} from '@chainsafe/libp2p-yamux'
import {bootstrap} from '@libp2p/bootstrap'
import {identify} from '@libp2p/identify'
import {kadDHT, passthroughMapper} from '@libp2p/kad-dht'
import {peerIdFromString} from '@libp2p/peer-id'
import {createFromJSON} from '@libp2p/peer-id-factory'
import {ping} from '@libp2p/ping'
import {tcp} from '@libp2p/tcp'
import {logger, seconds} from '@leverj/common/utils'
import {pipe} from 'it-pipe'
import {createLibp2p} from 'libp2p'
import {fromString as uint8ArrayFromString} from 'uint8arrays/from-string'
import {toString as uint8ArrayToString} from 'uint8arrays/to-string'
import {events, PEER_CONNECT, PEER_DISCOVERY, tryAgainIfError} from './utils/index.js'

export default class NetworkNode {
  constructor({ip = '0.0.0.0', port = 0, peerIdJson, bootstrapNodes = []}) {
    this.peerIdJson = peerIdJson
    this.ip = ip
    this.port = port
    this.bootstrapNodes = bootstrapNodes
  }

  get multiaddrs() {
    return this.p2p.getMultiaddrs().map((addr) => addr.toString())
  }

  get peerId() {
    return this.p2p.peerId.toString()
  }

  get peers() {
    return this.p2p.getPeers().map((peer) => peer.toString())
  }

  exportJson() {
    return {
      privKey: uint8ArrayToString(this.p2p.peerId.privateKey, 'base64'),
      pubKey: uint8ArrayToString(this.p2p.peerId.publicKey, 'base64'),
      id: this.peerId,
    }
  }

  //Return true to block, false to allow the incoming to join network
  //FIXME - how do we want to control ? IP seems most logical choice, since peerID and ports can be generated at will.
  async gater(addr) {
    const ipsToBlock = [] //The blocklist can come from config
    const idx = ipsToBlock.findIndex(_ => addr.indexOf(_) > -1)
    return idx > -1
  }

  async create() {
    this.p2p = await createLibp2p({
      peerId: this.peerIdJson ? await createFromJSON(this.peerIdJson) : undefined,
      addresses: {
        listen: [`/ip4/${this.ip}/tcp/${this.port}`],
        announce: [`/ip4/${config.externalIp}/tcp/${this.port}`],
      },
      connectionGater: {
        denyInboundConnection: (maConn => this.gater(maConn.remoteAddr.toString())),
      },
      transports: [tcp()],
      connectionEncryption: [noise()],
      streamMuxers: [yamux()],
      connectionManager: {inboundConnectionThreshold: 100 /*Default is 5*/},
      services: {
        ping: ping({protocolPrefix: 'autonat'}), pubsub: gossipsub(), identify: identify(),
        dht: kadDHT({protocol: '/libp2p/autonat/1.0.0', peerInfoMapper: passthroughMapper, clientMode: false}),
        // nat: autoNAT({
        //   protocolPrefix: 'autonat', // this should be left as the default value to ensure maximum compatibility
        //   timeout: 30000, // the remote must complete the AutoNAT protocol within this timeout
        //   maxInboundStreams: 1, // how many concurrent inbound AutoNAT protocols streams to allow on each connection
        //   maxOutboundStreams: 1 // how many concurrent outbound AutoNAT protocols streams to allow on each connection
        // })
      },
      peerDiscovery: this.bootstrapNodes.length ? [bootstrap({
        autoDial: true,
        interval: 60 * seconds,
        enabled: true,
        list: this.bootstrapNodes,
      })] : undefined,
    })

    this.p2p.addEventListener(PEER_CONNECT, this.peerConnected.bind(this))
    this.p2p.addEventListener(PEER_DISCOVERY, this.peerDiscovered.bind(this))
    return this
  }

  async start() {
    await this.p2p.start()
    return this
  }

  async stop() {
    await this.p2p.stop()
    return this
  }

  async connect(peerId) {
    await this.p2p.dial(peerIdFromString(peerId))
    return this
  }

  findPeer(peerId) {
    return this.p2p.peerRouting.findPeer(peerIdFromString(peerId))
  }

  peerDiscovered(event) {
    const {detail: peer} = event
    events.emit(PEER_DISCOVERY, peer.id.toString())
  }

  //fixme: remove this peer from the network
  peerConnected(event) {
    const peerId = event.detail.toString()
    // if (!this.knownPeers[peerId]) {
    //   // this.p2p.hangUp(peerId)
    // }
  }

  // pubsub connection
  async connectPubSub(peerId, handler) {
    this.p2p.services.pubsub.addEventListener('message', message => {
      const {from: peerId, topic, data, signature} = message.detail
      // fixme: signature verification
      handler({peerId: peerId.toString(), topic, data: new TextDecoder().decode(data)})
    })
    await this.p2p.services.pubsub.connect(peerId)
  }

  async subscribe(topic) {
    await this.p2p.services.pubsub.subscribe(topic)
  }

  async publish(topic, data) {
    await this.p2p.services.pubsub.publish(topic, new TextEncoder().encode(data))
  }

  // p2p connection
  async createAndSendMessage(peerId, protocol, message, responseHandler) {
    logger.log('Sending', peerId, message)
    try {
      const stream = await this.createStream(peerId, protocol)
      await this.sendMessageOnStream(stream, message)
      await this.readStream(stream, responseHandler)
      return stream
    } catch (e) {
      logger.error(`fail to send message to ${peerId}. message: ${message}`, e)
    }
  }

  async createStream(peerId, protocol) {
    return await tryAgainIfError(_ => this.p2p.dialProtocol(peerIdFromString(peerId), protocol))
  }

  async sendMessageOnStream(stream, message) {
    return stream.sink([uint8ArrayFromString(message)])
  }

  async readStream(stream, handler) {

    pipe(stream.source, (source) => map(source, (buf) => uint8ArrayToString(buf.subarray())), async (source) => {
      for await (const msg of source) handler(msg)
    })
  }

  registerStreamHandler(protocol, handler) {
    this.p2p.handle(protocol, async ({stream, connection: {remotePeer}}) => {
      pipe(stream.source, (source) => map(source, (buf) => uint8ArrayToString(buf.subarray())), async (source) => {
        for await (const msg of source) handler(stream, remotePeer.string, msg)
      })
    })
  }

  // implement ping pong between nodes to maintain status
  async ping(peerId) {
    try {
      return await this.p2p.services.ping.ping(peerIdFromString(peerId))
    } catch (e) {
      return -1
    }
  }
}
