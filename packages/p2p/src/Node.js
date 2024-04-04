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

export default class Node {
  constructor({ip = '127.0.0.1', port = 0, isLeader = false, peerIdJson}) {
    this.peerIdJson = peerIdJson
    this.ip = ip
    this.port = port
    this.isLeader = isLeader
    this.streams = {}

  }

  get multiaddrs() { return this.node.getMultiaddrs().map((addr) => addr.toString()) }

  get peerId() { return this.node.peerId.toString() }

  get peers() { return this.node.getPeers().map((peer) => peer.toString()) }

  exportPeerId() {
    return {
      privKey: uint8ArrayToString(this.node.peerId.privateKey, 'base64'),
      pubKey: uint8ArrayToString(this.node.peerId.publicKey, 'base64'),
      id: this.peerId
    }
  }

  async create() {
    const peerId = this.peerIdJson ? await createFromJSON(this.peerIdJson) : undefined
    this.node = await createLibp2p({
      peerId,
      addresses: {listen: [`/ip4/${this.ip}/tcp/${this.port}`],},
      transports: [ tcp()],
      connectionEncryption: [noise()],
      streamMuxers: [yamux()],
      services: {ping: ping({protocolPrefix: 'ipfs'}), pubsub: gossipsub(),},
    })
    this.node.addEventListener('peer:connect', this.peerConnected.bind(this))
    return this
  }

  async start() {
    await this.node.start()
    return this
  }

  async stop() {
    await this.node.stop()
    for (const stream of Object.values(this.streams)) await stream.close()
    return this
  }

  async connect(address) {
    await this.node.dial(multiaddr(address))
    return this
  }

  peerConnected(evt) { /*console.log('peer connected', evt.detail) */}

  // pubsub connection
  async connectPubSub(peerId, handler) {
    this.node.services.pubsub.addEventListener('message', message => {
      const {from: peerId, topic, data, signature} = message.detail
      // fixme: signature verification
      handler({peerId: peerId.toString(), topic, data: new TextDecoder().decode(data)})
    })
    await this.node.services.pubsub.connect(peerId)
  }

  async subscribe(topic) { await this.node.services.pubsub.subscribe(topic)}

  async publish(topic, data) { await this.node.services.pubsub.publish(topic, new TextEncoder().encode(data)) }

  // p2p connection
  async createAndSendMessage(address, protocol, message, responseHandler) {
    let stream = await this.createStream(address, protocol)
    this.sendMessage(stream, message)
    this.readStream(stream, responseHandler)
    return stream
  }

  async createStream(address, protocol) {
    let stream = await this.node.dialProtocol(multiaddr(address), protocol)
    this.streams[protocol] = stream
    return stream
  }

  sendMessage(stream, message) {
    pipe(
      message,
      (message) => [uint8ArrayFromString(message)],
      stream.sink
    )
  }

  readStream(stream, handler) {
    pipe(
      stream.source,
      (source) => map(source, (buf) => uint8ArrayToString(buf.subarray())),
      async (source) => {
        for await (const msg of source) handler(msg)
      }
    )
  }

  registerStreamHandler(protocol, handler) {
    this.node.handle(protocol, async ({stream, connection: {remotePeer}}) => {
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
  async ping(address) { return await this.node.services.ping.ping(multiaddr(address)) }
}