import NetworkNode from './NetworkNode.js'
import {TSSNode, generateDkgId} from './TSSNode.js'
import {affirm, logger} from '@leverj/common/utils'
import {tryAgainIfEncryptionFailed, tryAgainIfError, waitToSync} from './utils.js'
import events, {INFO_CHANGED} from './events.js'
import config from 'config'

const TSS_RECEIVE_SIGNATURE_SHARE = 'TSS_RECEIVE_SIGNATURE_SHARE'
const SIGNATURE_START = 'SIGNATURE_START'
const WHITELIST_TOPIC = 'WHITELIST'
const DKG_INIT_THRESHOLD_VECTORS = 'DKG_INIT_THRESHOLD_VECTORS'
const DKG_RECEIVE_KEY_SHARE = 'DKG_RECEIVE_KEY_SHARE'
const meshProtocol = '/bridgeNode/0.0.1'
console.log('BridgeNodes', config.bridgeNode.bootstrapNodes)

class BridgeNode extends NetworkNode {
  constructor({ip = '0.0.0.0', port = 0, isLeader = false, json}) {
    super({ip, port, peerIdJson: json?.p2p})
    this.isLeader = isLeader
    this.tssNodeJson = json?.tssNode
    this.whitelistedPeersJson = json?.whitelistedPeers
    this.leader = json?.leader
    this.tssNode = null
    this.state = null
    this.whitelisted = {}
    this.messageMap = {}
  }

  exportJson() {
    return {
      p2p: super.exportJson(),
      tssNode: this.tssNode.exportJson(),
      whitelistedPeers: this.whitelisted,
      leader: this.leader
    }
  }

  async create() {
    await super.create()
    this.tssNode = new TSSNode(this.peerId, this.tssNodeJson)
    let dkgId = this.tssNode.id.serializeToHexStr()
    this.tssNode.addMember(dkgId, this.tssNode.onDkgShare.bind(this.tssNode)) // making self dkg share
    this.registerStreamHandler(meshProtocol, this.onStreamMessage.bind(this))
    if (this.whitelistedPeersJson) for (const {peerId} of Object.values(this.whitelistedPeersJson)) {
      this.addPeersToWhiteList({peerId})
    }
    events.emit(INFO_CHANGED)
    await this.start()
    await this.addLeader()
    return this
  }

  async addLeader() {
    this.leader = this.isLeader? this.peerId : config.bridgeNode.bootstrapNodes[0].split('/').pop()
    this.addPeersToWhiteList({peerId: this.leader})
    if (this.isLeader) return
    await waitToSync([_ => this.peers.indexOf(this.leader) !== -1])
    await tryAgainIfEncryptionFailed(async () => await this.connect(this.leader))
    await this.connectPubSub(this.leader)
    // await this.subscribe(WHITELIST_TOPIC)
    await this.subscribe(SIGNATURE_START)
    console.log('Connected to leader', this.port, this.leader)
  }

  addPeersToWhiteList(...peers) {
    for (const {peerId} of peers) {
      if (this.whitelisted[peerId]) continue
      const dkgId = generateDkgId(peerId)
      this.whitelisted[peerId] = {peerId, dkgId}
      if (peerId !== this.peerId) this.tssNode.addMember(dkgId, this.sendMessageToPeer.bind(this, peerId, DKG_RECEIVE_KEY_SHARE))
    }
    events.emit(INFO_CHANGED)
  }

  async publishWhitelist() {
    if (!this.isLeader) return
    this.addPeersToWhiteList(...this.peers.map(peerId => ({peerId})))
    let message = JSON.stringify(Object.values(this.whitelisted))
    await this.publishOrFanOut(WHITELIST_TOPIC, message)
  }

  async publishOrFanOut(topic, message, fanOut = true) {
    if (!fanOut) return await this.publish(topic, message)
    for (const {peerId} of Object.values(this.whitelisted)) {
      if (peerId === this.peerId) continue
      console.log('FanOut', peerId, topic, message)
      await this.sendMessageToPeer(peerId, topic, message)
    }
  }

  async aggregateSignature(txnHash, message) {
    const signature = await this.tssNode.sign(message)
    this.messageMap[txnHash] = {}
    this.messageMap[txnHash].verified = false
    this.messageMap[txnHash].signatures = [{message, signature: signature.serializeToHexStr(), 'signer': this.tssNode.id.serializeToHexStr()}]
    await this.publish(SIGNATURE_START, JSON.stringify({txnHash, message}))
  }

  async connectToWhiteListedPeers() {
    for (const peerId of Object.keys(this.whitelisted)) {
      if (peerId === this.peerId) continue
      await tryAgainIfEncryptionFailed(_ => this.connect(peerId))
    }
  }

  async sendMessageToPeer(peerId, topic, message) {
    const messageStr = JSON.stringify({topic, message})
    await this.createAndSendMessage(peerId, meshProtocol, messageStr)
  }

  async connectPubSub(peerId) {
    await super.connectPubSub(peerId, this.onPubSubMessage.bind(this))
  }

  async onPubSubMessage({peerId, topic, data}) {
    switch (topic) {
      case WHITELIST_TOPIC:
        await this.handleWhitelistMessage(peerId, JSON.parse(data))
        break
      case SIGNATURE_START:
        if (this.leader !== peerId) return logger.log('Ignoring signature start from non-leader', peerId, this.leader)
        const {txnHash, message} = JSON.parse(data)
        const signature = await this.tssNode.sign(message)
        logger.log(SIGNATURE_START, txnHash, message, signature.serializeToHexStr())
        const signaturePayloadToLeader = {topic: TSS_RECEIVE_SIGNATURE_SHARE, signature: signature.serializeToHexStr(), signer: this.tssNode.id.serializeToHexStr(), txnHash}
        await this.createAndSendMessage(peerId, meshProtocol, JSON.stringify(signaturePayloadToLeader), (msg) => { console.log('SignaruePayload Ack', msg) })
        break
      default:
        console.log('Unknown topic', topic)
    }
  }

  async handleWhitelistMessage(peerId, peers) {
    if (this.leader !== peerId) return logger.log('Ignoring whitelist from non-leader', peerId)
    this.addPeersToWhiteList(...peers)
  }

  async onStreamMessage(stream, peerId, msgStr) {
    const msg = JSON.parse(msgStr)
    affirm(this.whitelisted[peerId], `Unknown peer ${peerId}`)
    switch (msg.topic) {
      case WHITELIST_TOPIC:
        await this.handleWhitelistMessage(peerId, JSON.parse(msg.message))
        break
      case DKG_INIT_THRESHOLD_VECTORS:
        this.tssNode.generateVectors(msg.threshold)
        await this.tssNode.generateContribution()
        break
      case DKG_RECEIVE_KEY_SHARE:
        this.tssNode.onDkgShare(msg.message)
        break
      case TSS_RECEIVE_SIGNATURE_SHARE:
        this.messageMap[msg.txnHash].signatures.push({signature: msg.signature, signer: msg.signer})
        logger.log('Received signature', msg.txnHash, msg.signature,)
        if (this.messageMap[msg.txnHash].signatures.length === this.tssNode.threshold) {
          const groupSign = this.tssNode.groupSign(this.messageMap[msg.txnHash].signatures)
          this.messageMap[msg.txnHash].verified = this.tssNode.verify(groupSign, this.messageMap[msg.txnHash].signatures[0].message)
          logger.log('Verified', msg.txnHash, this.messageMap[msg.txnHash].verified, groupSign)
        }
        break
      default:
        console.log('Unknown message', msg)
    }
  }

  getAggregateSignature(txnHash) {
    return this.messageMap[txnHash]
  }

  async startDKG(threshold) {
    if (!this.isLeader) return
    const responseHandler = (msg) => console.log('dkg received', msg)
    for (const peerId of Object.keys(this.whitelisted)) {
      if (this.peerId === peerId) continue
      let message = JSON.stringify({topic: DKG_INIT_THRESHOLD_VECTORS, threshold})
      await this.createAndSendMessage(peerId, meshProtocol, message, responseHandler)
    }
    await this.tssNode.generateVectors(threshold)
    await this.tssNode.generateContribution()
  }
}

export default BridgeNode