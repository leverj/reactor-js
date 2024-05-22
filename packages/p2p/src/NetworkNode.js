import {createLibp2p} from 'libp2p'
import {tcp} from '@libp2p/tcp'
import {noise} from '@chainsafe/libp2p-noise'
import {yamux} from '@chainsafe/libp2p-yamux'
import {ping} from '@libp2p/ping'
import {multiaddr} from 'multiaddr'
import {gossipsub} from '@chainsafe/libp2p-gossipsub'
import {fromString as uint8ArrayFromString} from 'uint8arrays/from-string'
import {toString as uint8ArrayToString} from 'uint8arrays/to-string'
import map from 'it-map'
import {pipe} from 'it-pipe'
import {createFromJSON} from '@libp2p/peer-id-factory'
import {tryAgainIfError} from './utils.js'

export default class NetworkNode {
  constructor({ip = '0.0.0.0', port = 0, isLeader = false, peerIdJson}) {
    this.peerIdJson = peerIdJson
    this.ip = ip
    this.port = port
    this.isLeader = typeof isLeader === 'string' ? isLeader === 'true' : isLeader
    this.streams = {}
  }

  get multiaddrs() { return this.p2p.getMultiaddrs().map((addr) => addr.toString()) }

  get peerId() { return this.p2p.peerId.toString() }

  get peers() { return this.p2p.getPeers().map((peer) => peer.toString()) }

  exportJson() {
    return {
      privKey: uint8ArrayToString(this.p2p.peerId.privateKey, 'base64'),
      pubKey: uint8ArrayToString(this.p2p.peerId.publicKey, 'base64'),
      id: this.peerId
    }
  }

  async create() {
    const peerId = this.peerIdJson ? await createFromJSON(this.peerIdJson) : undefined
    this.p2p = await createLibp2p({
      peerId,
      addresses: {listen: [`/ip4/${this.ip}/tcp/${this.port}`],},
      transports: [tcp()],
      connectionEncryption: [noise()],
      streamMuxers: [yamux()],
      connectionManager:{
        inboundConnectionThreshold: 25, //Default is 5
      },
      services: {ping: ping({protocolPrefix: 'ipfs'}), pubsub: gossipsub(),},
    })
    this.p2p.addEventListener('peer:connect', this.peerConnected.bind(this))
    return this
  }

  async start() {
    await this.p2p.start()
    return this
  }

  async stop() {
    await this.p2p.stop()
    for (const stream of Object.values(this.streams)) await stream.close()
    return this
  }

  async connect(address) {
    await this.p2p.dial(multiaddr(address))
    return this
  }

  //fixme: remove this peer from the network
  peerConnected(evt) {
    // const peerId = evt.detail.toString()
    // if (!this.knownPeers[peerId]) {
    //   console.log('remove this peer from the network')
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

  async subscribe(topic) { await this.p2p.services.pubsub.subscribe(topic)}

  async publish(topic, data) { await this.p2p.services.pubsub.publish(topic, new TextEncoder().encode(data)) }

  // p2p connection
  async createAndSendMessage(address, protocol, message, responseHandler) {
    let stream = await tryAgainIfError(_ => this.createStream(address, protocol))
    await this.sendMessageOnStream(stream, message)
    await this.readStream(stream, responseHandler)
    return stream
  }

  async createStream(address, protocol) {
    if (this.streams[protocol]) this.streams[protocol].close()
    let stream = await this.p2p.dialProtocol(multiaddr(address), protocol)
    this.streams[protocol] = stream
    return stream
  }

  async sendMessageOnStream(stream, message) {
    return stream.sink([uint8ArrayFromString(message)])
  }

  async readStream(stream, handler) {

    pipe(
      stream.source,
      (source) => map(source, (buf) => uint8ArrayToString(buf.subarray())),
      async (source) => {
        for await (const msg of source) handler(msg)
      }
    )
  }

  registerStreamHandler(protocol, handler) {
    //console.log("registerStreamHandler", this.peerId)
    this.p2p.handle(protocol, async ({stream, connection: {remotePeer}}) => {
      pipe(
        stream.source,
        (source) => map(source, (buf) => uint8ArrayToString(buf.subarray())),
        async (source) => {
          for await (const msg of source) handler(stream, remotePeer.string, msg)
        }
      )
    })
  }

  // implement ping pong between nodes to maintain status
  async ping(address) { return await this.p2p.services.ping.ping(multiaddr(address)) }
}