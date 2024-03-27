import {createLibp2p} from 'libp2p'
import {tcp} from '@libp2p/tcp'
import {noise} from '@chainsafe/libp2p-noise'
import {mplex} from '@libp2p/mplex'

export default class Node {
  constructor() {
  }

  async create() {
    this.node = await createLibp2p({
      addresses: {
        // add a listen address (localhost) to accept TCP connections on a random port
        listen: ['/ip4/127.0.0.1/tcp/0']
      },
      transports: [tcp()],
      connectionEncryption: [noise()],
      streamMuxers: [mplex()]
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

  async stop() {
    await this.node.stop()
    console.log('libp2p has stopped')
    return this
  }
}