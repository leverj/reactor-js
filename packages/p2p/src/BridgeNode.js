import {affirm, logger} from '@leverj/common/utils'
import {SecretKey} from '@leverj/reactor.mcl'
import {setTimeout} from 'node:timers/promises'
import {NetworkNode} from './NetworkNode.js'
import {TssNode} from './TssNode.js'
import {events, INFO_CHANGED, PEER_DISCOVERY, waitToSync} from './utils/index.js'

const TSS_RECEIVE_SIGNATURE_SHARE = 'TSS_RECEIVE_SIGNATURE_SHARE'
const SIGNATURE_START = 'SIGNATURE_START'
const WHITELIST_TOPIC = 'WHITELIST'
const WHITELIST_REQUEST = 'WHITELIST_REQUEST'
const DKG_INIT_THRESHOLD_VECTORS = 'DKG_INIT_THRESHOLD_VECTORS'
const DKG_RECEIVE_KEY_SHARE = 'DKG_RECEIVE_KEY_SHARE'
const meshProtocol = '/bridgeNode/0.0.1'

export class BridgeNode {
  static async from({ip = '0.0.0.0', port = 0, isLeader = false, json, bootstrapNodes}) {
    const network = await NetworkNode.from({ip, port, peerIdJson: json?.p2p, bootstrapNodes})
    const tss = new TssNode(network.peerId, json?.tssNode)
    tss.addMember(tss.id.serializeToHexStr(), tss.onDkgShare.bind(tss)) // making self dkg share
    const whitelist = new Whitelist(json?.whitelist || [])
    return new this(network, tss, whitelist, isLeader, json?.leader)
  }

  constructor(network, tss, whitelist, isLeader, leader) {
    this.network = network
    this.tss = tss
    this.whitelist = whitelist
    this.isLeader = isLeader
    this.leader = leader
    this.messageMap = {}
    this.components = {}
    this.monitor = new Monitor()
    this.network.registerStreamHandler(meshProtocol, this.onStreamMessage.bind(this))
    this.addPeersToWhiteList(...this.whitelist.initial)
    // fixme: changes when real whitelisting done
    if (this.isLeader) events.on(PEER_DISCOVERY, _ => this.addPeersToWhiteList(_))
  }

  get bootstrapNodes() { return this.network.bootstrapNodes }
  get multiaddrs() { return this.network.multiaddrs }
  get peerId() { return this.network.peerId }
  get peers() { return this.network.peers }

  get secretKeyShare() { return this.tss.secretKeyShare }
  get groupPublicKey() { return this.tss.groupPublicKey }

  exportJson() {
    return {
      p2p: this.network.exportJson(),
      tssNode: this.tss.exportJson(),
      whitelist: this.whitelist.get(),
      leader: this.leader,
    }
  }

  print() { this.tss.print() }

  async start() {
    await this.network.start()
    await this.addLeader()
    if (!this.isLeader) await this.sendMessageToPeer(this.leader, WHITELIST_REQUEST, '')
    events.emit(INFO_CHANGED)
    this.ping()
    return this
  }

  async stop() { return this.network.stop() }

  async connect(peerId) { return this.network.connect(peerId) }

  async addLeader() {
    this.leader = this.isLeader ? this.peerId : this.bootstrapNodes[0].split('/').pop()
    this.addPeersToWhiteList(this.leader)
    if (this.isLeader) return
    await waitToSync([_ => this.peers.indexOf(this.leader) !== -1], -1)
  }

  addPeersToWhiteList(...peerIds) {
    if (peerIds.length === 0) return
    peerIds.forEach(_ => {
      const dkgId = this.whitelist.add(_)
      if (_ !== this.peerId) this.tss.addMember(dkgId, this.sendMessageToPeer.bind(this, _, DKG_RECEIVE_KEY_SHARE))
    })
    logger.log('Added to whitelist', peerIds.map(_ => `${_.slice(0, 4)}..${_.slice(-3)}`).join(', '))
    events.emit(INFO_CHANGED)
  }

  async publishWhitelist() {
    if (!this.isLeader) return
    this.whitelist.canPublish = true
    const whitelist = this.whitelist.get()
    await this.publishOrFanOut(WHITELIST_TOPIC, whitelist, this.monitor.filter(whitelist))
  }

  async publishOrFanOut(topic, message, peerIds, fanOut = true) {
    if (!fanOut) return await this.network.publish(topic, message)

    for (let each of peerIds) {
      if (each === this.peerId) continue
      await this.sendMessageToPeer(each, topic, message)
    }
  }

  async aggregateSignature(txnHash, message, chainId, callback) {
    const signature = await this.tss.sign(message)
    this.messageMap[txnHash] = {signatures: {}, verified: false, depositCallback: callback}
    this.messageMap[txnHash].signatures[this.tss.id.serializeToHexStr()] = {
      message,
      signature: signature.serializeToHexStr(),
      signer: this.tss.id.serializeToHexStr(),
    }
    await this.publishOrFanOut(SIGNATURE_START, JSON.stringify({
      txnHash,
      message,
      chainId,
    }), this.monitor.filter(this.whitelist.get()))
  }

  async sendMessageToPeer(peerId, topic, message) {
    const messageStr = JSON.stringify({topic, message})
    await this.network.createAndSendMessage(peerId, meshProtocol, messageStr, _ => logger.log(`${topic} response from ${peerId} `, _))
  }

  async connectPubSub(peerId) { return this.network.connectPubSub(peerId, this.onPubSubMessage.bind(this)) }

  async onPubSubMessage({peerId, topic, data}) {
    switch (topic) {
      case WHITELIST_TOPIC: return this.handleWhitelistMessage(peerId, JSON.parse(data))
      case SIGNATURE_START: return this.handleSignatureStart(peerId, JSON.parse(data))
      default: logger.log('Unknown topic', topic)
    }
  }

  async handleWhitelistMessage(peerId, peerIds) {
    this.leader === peerId ?
      this.addPeersToWhiteList(...peerIds) :
      logger.log('Ignoring whitelist from non-leader', peerId)
  }

  async handleSignatureStart(peerId, data) {
    if (this.leader !== peerId) return logger.log('Ignoring signature start from non-leader', peerId, this.leader)
    const {txnHash, message, chainId} = data
    if (!await this.deposit.verifySentHash(chainId, data.message)) return

    const signature = await this.tss.sign(message)
    logger.log(SIGNATURE_START, txnHash, message, signature.serializeToHexStr())
    const signaturePayloadToLeader = {
      topic: TSS_RECEIVE_SIGNATURE_SHARE,
      signature: signature.serializeToHexStr(),
      signer: this.tss.id.serializeToHexStr(),
      txnHash,
    }
    await this.network.createAndSendMessage(peerId, meshProtocol, JSON.stringify(signaturePayloadToLeader), _ => logger.log('SignaruePayload Ack', _))
  }

  async onStreamMessage(stream, peerId, msgStr) {
    const msg = JSON.parse(msgStr)
    affirm(this.whitelist.exists(peerId, `Unknown peer ${peerId}`))
    switch (msg.topic) {
      case WHITELIST_REQUEST:
        if (this.whitelist.canPublish) await this.sendMessageToPeer(peerId, WHITELIST_TOPIC, this.whitelist.get())
        return
      case WHITELIST_TOPIC:
        return this.handleWhitelistMessage(peerId, msg.message)
      case DKG_INIT_THRESHOLD_VECTORS:
        this.tss.generateVectors(msg.threshold)
        return this.tss.generateContribution()
      case DKG_RECEIVE_KEY_SHARE:
        return this.tss.onDkgShare(msg.message)
      case TSS_RECEIVE_SIGNATURE_SHARE:
        const {txnHash, signature, signer} = msg
        this.messageMap[txnHash].signatures[signer] = ({signature: signature, signer: signer})
        logger.log('Received signature', txnHash, signature)
        if (Object.keys(this.messageMap[txnHash].signatures).length === this.tss.threshold) {
          const groupSign = this.tss.groupSign(Object.values(this.messageMap[txnHash].signatures))
          this.messageMap[txnHash].groupSign = groupSign
          this.messageMap[txnHash].verified = this.tss.verify(groupSign, this.messageMap[txnHash].signatures[this.tss.id.serializeToHexStr()].message)
          logger.log('Verified', txnHash, this.messageMap[txnHash].verified, groupSign)
          this.messageMap[txnHash].depositCallback(this.messageMap[txnHash])
        }
        return
      case SIGNATURE_START:
        return this.handleSignatureStart(peerId, JSON.parse(msg.message))
      default:
        logger.log('Unknown message', msg)
    }
  }

  getAggregateSignature(txnHash) { return this.messageMap[txnHash] }

  setDeposit(deposit) { this.deposit = deposit }

  async startDKG(threshold) {
    if (!this.isLeader) return
    const responseHandler = (msg) => logger.log('dkg received', msg)
    for (let each of this.whitelist.get()) {
      if (each === this.peerId) continue
      const message = JSON.stringify({topic: DKG_INIT_THRESHOLD_VECTORS, threshold})
      await this.network.createAndSendMessage(each, meshProtocol, message, responseHandler)
    }
    await this.tss.generateVectors(threshold)
    await this.tss.generateContribution()
  }

  async ping() {
    const peerIds = this.whitelist.get()
    for (let each of peerIds) {
      if (each === this.peerId) continue
      this.monitor.updateLatency(each, await this.network.ping(each))
      await setTimeout(100)
    }
    setTimeout(1000).then(this.ping.bind(this))
  }
}

class Whitelist {
  constructor(initial) {
    this.allowed = {}
    this.initial = initial
    this.canPublish = false
  }

  exists(peerId) { return this.allowed[peerId] }
  get() { return Object.keys(this.allowed) }
  add(peerId) {
    this.allowed[peerId] = new SecretKey().setHashOfString(peerId).serializeToHexStr()
    return this.allowed[peerId]
  }
}

class Monitor {
  constructor() { this.peers = {} }

  updateLatency(peerId, latency) {
    if (!this.peers[peerId]) this.peers[peerId] = {}
    this.peers[peerId].latency = latency
  }
  getPeersStatus() { return Object.entries(this.peers).map(([peerId, {latency}]) => ({peerId, latency})) }
  filter(peerIds) { return peerIds.filter(_ => this.peers[_]?.latency !== -1)}
  print() { logger.table(this.peers) }
}
