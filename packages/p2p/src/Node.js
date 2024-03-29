import {createLibp2p} from 'libp2p'
import {tcp} from '@libp2p/tcp'
import {noise} from '@chainsafe/libp2p-noise'
import {yamux} from '@chainsafe/libp2p-yamux'
import {ping} from '@libp2p/ping'
import {multiaddr} from 'multiaddr'
import {gossipsub} from '@chainsafe/libp2p-gossipsub'


export default class Node {
  constructor(ip= '127.0.0.1', port = 0, isLeader = false) {
    this.ip = ip
    this.port = port
    this.isLeader = isLeader
    this.msgMap = {}
  }

  async create() {
    this.node = await createLibp2p({
      addresses: {
        // add a listen address (localhost) to accept TCP connections on a random port
        listen: [`/ip4/${this.ip}/tcp/${this.port}`],
      },
      transports: [tcp()],
      connectionEncryption: [noise()],
      streamMuxers: [yamux()],
      services: {
        ping: ping({protocolPrefix: 'ipfs'}),
        pubsub: gossipsub({emitSelf: true}),
      },
    })
    return this
  }

  async start() {
    await this.node.start()
    return this
  }

  get multiaddrs() {
    return this.node.getMultiaddrs().map((addr) => addr.toString())
  }

  async ping(address) {
    return await this.node.services.ping.ping(multiaddr(address))
  }

  async connect(address) {
    await this.node.dial(multiaddr(address))
    return this
  }

  async stop() {
    await this.node.stop()
    return this
  }
}