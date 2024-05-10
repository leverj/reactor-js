import NetworkNode from './NetworkNode.js'
import {TSSNode, generateDkgId} from './TSSNode.js'
import {affirm} from '@leverj/common/utils'
import {setTimeout} from 'timers/promises'
import {tryAgainIfEncryptionFailed} from './utils.js'


const DKG_INIT_THRESHOLD_VECTORS = 'DKG_INIT_THRESHOLD_VECTORS'
const DKG_RECEIVE_KEY_SHARE = 'DKG_RECEIVE_KEY_SHARE'
const TSS_RECEIVE_SIGNATURE_SHARE = 'TSS_RECEIVE_SIGNATURE_SHARE'
const meshProtocol = '/bridgeNode/0.0.1'


class BridgeNode extends NetworkNode {
  constructor({ip = '0.0.0.0', port = 0, isLeader = false, json}) {
    super({ip, port, isLeader, peerIdJson: json?.p2p})
    this.tssNodeJson = json?.tssNode
    this.whitelistedPeersJson = json?.whitelistedPeers
    this.tssNode = null
    this.state = null
    this.whitelisted = {}
  }

  exportJson() {
    return {
      p2p: super.exportJson(),
      tssNode: this.tssNode.exportJson(),
      whitelistedPeers: this.whitelisted
    }
  }

  async create() {
    await super.create()
    this.tssNode = new TSSNode(this.peerId, this.tssNodeJson)
    let dkgId = this.tssNode.id.serializeToHexStr()
    this.tssNode.addMember(dkgId, this.tssNode.onDkgShare.bind(this.tssNode)) // making self dkg share
    this.registerStreamHandler(meshProtocol, this.onStreamMessage.bind(this))
    if(this.whitelistedPeersJson) for (const [peerId, {multiaddr, ip, port}] of Object.entries(this.whitelistedPeersJson)) {
      this.addPeersToWhiteList({peerId, multiaddr, ip, port})
    }
    return this
  }
  addPeersToWhiteList(...peers) {
    for (const {peerId, multiaddr, ip, port} of peers) {
      if(this.whitelisted[peerId]) continue
      const dkgId = generateDkgId(peerId)
      this.whitelisted[peerId] = {dkgId, multiaddr, ip, port}
      if (peerId !== this.peerId) this.tssNode.addMember(dkgId, this.sendMessageToPeer.bind(this, multiaddr, DKG_RECEIVE_KEY_SHARE))
    }
  }

  async connectToWhiteListedPeers() {
    for (const peerId of Object.keys(this.whitelisted)) {
      if (peerId === this.peerId) continue
      await tryAgainIfEncryptionFailed(_ => this.connect(this.whitelisted[peerId].multiaddr))
    }
  }

  async sendMessageToPeer(multiaddr, topic, message) {
    const messageStr = JSON.stringify({topic, message})
    await this.createAndSendMessage(multiaddr, meshProtocol, messageStr)
  }

  async onStreamMessage(stream, peerId, msgStr) {
    const msg = JSON.parse(msgStr)
    affirm(this.whitelisted[peerId], `Unknown peer ${peerId}`)
    // console.log('received message',  msg.topic, TSSNode.TOPICS.DKG_RECEIVE_KEY_SHARE)
    switch (msg.topic) {
      case DKG_INIT_THRESHOLD_VECTORS:
        this.tssNode.generateVectors(msg.threshold)
        await this.tssNode.generateContribution()
        break
      case DKG_RECEIVE_KEY_SHARE:
        // console.log('received message',  msg.topic)
        this.tssNode.onDkgShare(msg.message)
        break
      default:
        console.log('Unknown message', msg)
    }
  }

  async startDKG(threshold) {
    if (!this.isLeader) return
    const responseHandler = (msg) => console.log('dkg received', msg)
    for (const peerId of Object.keys(this.whitelisted)) {
      if (this.peerId === peerId) continue
      let multiaddr = this.whitelisted[peerId].multiaddr
      let message = JSON.stringify({topic: DKG_INIT_THRESHOLD_VECTORS, threshold})
      await this.createAndSendMessage(multiaddr, meshProtocol, message, responseHandler)
    }
    await this.tssNode.generateVectors(threshold)
    await this.tssNode.generateContribution()
  }
}

export default BridgeNode