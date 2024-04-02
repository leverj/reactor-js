import {createLibp2p} from 'libp2p'
import {tcp} from '@libp2p/tcp'
import {noise} from '@chainsafe/libp2p-noise'
import {yamux} from '@chainsafe/libp2p-yamux'
import {ping} from '@libp2p/ping'
import {multiaddr} from 'multiaddr'
import {gossipsub} from '@chainsafe/libp2p-gossipsub'


export default class Node {
  constructor(ip = '127.0.0.1', port = 0, isLeader = false) {
    this.ip = ip
    this.port = port
    this.isLeader = isLeader
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
      services: {ping: ping({protocolPrefix: 'ipfs'}), pubsub: gossipsub({emitSelf: true}),},
    })
    return this
  }

  async start() {
    await this.node.start()
    return this
  }

  async ping(address) { return await this.node.services.ping.ping(multiaddr(address)) }

  async connect(address) {
    await this.node.dial(multiaddr(address))
    return this
  }

  async subscribe(peerId, topic, handler) {
    this.node.services.pubsub.addEventListener('message', handler)
    await this.node.services.pubsub.subscribe(topic)
    await this.node.services.pubsub.connect(peerId)
  }

  async addEventListener(event, handler) { this.node.addEventListener(event, handler) }
  async publish(topic, data) { await this.node.services.pubsub.publish(topic, new TextEncoder().encode(data)) }

  createStream(peerId, protocol) { return this.node.dialProtocol(multiaddr(peerId), protocol) }
  async stop() {
    await this.node.stop()
    return this
  }
}