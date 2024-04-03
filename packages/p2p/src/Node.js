import {createLibp2p} from 'libp2p'
import {tcp} from '@libp2p/tcp'
import {noise} from '@chainsafe/libp2p-noise'
import {yamux} from '@chainsafe/libp2p-yamux'
import {ping} from '@libp2p/ping'
import {multiaddr} from 'multiaddr'
import {gossipsub} from '@chainsafe/libp2p-gossipsub'
import {fromString as uint8ArrayFromString} from 'uint8arrays/from-string'
import map from 'it-map'
import {toString as uint8ArrayToString} from 'uint8arrays/to-string'


export default class Node {
  constructor(ip = '127.0.0.1', port = 0, isLeader = false) {
    this.ip = ip
    this.port = port
    this.isLeader = isLeader
    this.streams = {}
  }

  get multiaddrs() { return this.node.getMultiaddrs().map((addr) => addr.toString()) }

  get peerId() { return this.node.peerId.toString() }

  get peers() { return this.node.getPeers().map((peer) => peer.toString()) }

  async create() {
    this.node = await createLibp2p({
      addresses: {listen: [`/ip4/${this.ip}/tcp/${this.port}`],},
      transports: [tcp()],
      connectionEncryption: [noise()],
      streamMuxers: [yamux()],
      services: {ping: ping({protocolPrefix: 'ipfs'}), pubsub: gossipsub(),},
    })
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
  async createStream(address, protocol) {
    let stream = await this.node.dialProtocol(multiaddr(address), protocol)
    this.streams[protocol] = stream
    return stream
  }

  async sendMessage(protocol, message) { return this.streams[protocol].sink([uint8ArrayFromString(message)])}

  async registerStreamHandler(protocol, handler) {
    this.node.handle(protocol, async ({stream, connection:{remotePeer}}) => {
      const messages = map(stream.source, (buf) => uint8ArrayToString(buf.subarray()))
      for await (const msg of messages) {
        handler(remotePeer.string, msg)
      }
    })
  }
  // implement ping pong between nodes to maintain status
  async ping(address) { return await this.node.services.ping.ping(multiaddr(address)) }
}