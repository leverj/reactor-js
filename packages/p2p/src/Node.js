import {createLibp2p} from 'libp2p'
import {tcp} from '@libp2p/tcp'
import {noise} from '@chainsafe/libp2p-noise'
import {yamux} from '@chainsafe/libp2p-yamux'
import {ping} from '@libp2p/ping'
import {multiaddr} from 'multiaddr'

export default class Node {
  constructor(port = 0, ip = '127.0.0.1') {
    this.ip = ip
    this.port = port
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
      services: {ping: ping({protocolPrefix: 'ipfs'}),},
    })
    return this
  }

  async start() {
    await this.node.start()
    console.log('libp2p has started')

    console.log('listening on addresses:')
    this.node.getMultiaddrs().forEach((addr) => {
      console.log(addr.toString())
    })
    return this
  }

  get multiaddrs() {
    return this.node.getMultiaddrs().map((addr) => addr.toString())
  }

  async ping(address) {
    const latency = await this.node.services.ping.ping(multiaddr(address))
    console.log(`${this.node.peerId.string} pinged ${address} in ${latency}ms`)
    return this
  }

  async stop() {
    await this.node.stop()
    console.log('libp2p has stopped')
    return this
  }
}