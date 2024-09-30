import map from 'it-map'
import {peerIdFromString} from '@libp2p/peer-id'
import {logger} from '@leverj/common'
import {pipe} from 'it-pipe'
import {fromString as uint8ArrayFromString} from 'uint8arrays/from-string'
import {toString as uint8ArrayToString} from 'uint8arrays/to-string'
import {events, PEER_CONNECT, PEER_DISCOVERY, tryAgainIfError} from './utils.js'
import {P2P} from './P2P.js'

export class NetworkNode {
  static async from(config, port, peerIdJson, bootstrapNodes) {
    const ip = '0.0.0.0'
    const p2p = await P2P(peerIdJson, ip, port, config.externalIp, bootstrapNodes)
    return new this(config, port, bootstrapNodes, p2p)
  }

  constructor(config, port, bootstrapNodes, p2p) {
    this.config = config
    this.port = port
    this.bootstrapNodes = bootstrapNodes
    this.p2p = p2p
    this.p2p.addEventListener(PEER_CONNECT, _ => this.peerConnected(_))
    this.p2p.addEventListener(PEER_DISCOVERY, _ => this.peerDiscovered(_))
  }

  get multiaddrs() { return this.p2p.getMultiaddrs().map(_ => _.toString()) }
  get peerId() { return this.p2p.peerId.toString() }
  get peers() { return this.p2p.getPeers().map(_ => _.toString()) }

  state() {
    return {
      privKey: uint8ArrayToString(this.p2p.peerId.privateKey, 'base64'),
      pubKey: uint8ArrayToString(this.p2p.peerId.publicKey, 'base64'),
      id: this.peerId,
    }
  }

  async start() { return await this.p2p.start() }

  async stop() { return await this.p2p.stop() }

  async connect(peerId) { return this.p2p.dial(peerIdFromString(peerId)) }

  findPeer(peerId) { return this.p2p.peerRouting.findPeer(peerIdFromString(peerId)) }

  peerDiscovered(event) { events.emit(PEER_DISCOVERY, event.detail.id.toString()) }

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
      //fixme: signature verification
      handler({peerId: peerId.toString(), topic, data: new TextDecoder().decode(data)})
    })
    await this.p2p.services.pubsub.connect(peerId)
  }

  async subscribe(topic) { return this.p2p.services.pubsub.subscribe(topic) }

  async publish(topic, data) { return this.p2p.services.pubsub.publish(topic, new TextEncoder().encode(data)) }

  // p2p connection
  async sendMessageTo(peerId, protocol, message, responseHandler) {
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
    const {tryCount, timeout, port} = this.config
    return tryAgainIfError(_ => this.p2p.dialProtocol(peerIdFromString(peerId), protocol), tryCount, timeout, port)
  }

  async sendMessageOnStream(stream, message) { return stream.sink([uint8ArrayFromString(message)]) }

  async readStream(stream, handler) {
    pipe(
      stream.source,
      (source) => map(source, (buffer) => uint8ArrayToString(buffer.subarray())),
      async (source) => { for await (const each of source) handler(each) }
    )
  }

  registerStreamHandler(protocol, handler) {
    this.p2p.handle(protocol, async ({stream, connection: {remotePeer}}) => {
      pipe(
        stream.source,
        (source) => map(source, (buf) => uint8ArrayToString(buf.subarray())),
        async (source) => { for await (const each of source) handler(stream, remotePeer.string, each) }
      )
    })
  }

  async ping(peerId) {
    try {
      return await this.p2p.services.ping.ping(peerIdFromString(peerId))
    } catch (e) {
      return -1
    }
  }
}
