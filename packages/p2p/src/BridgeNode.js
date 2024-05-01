import NetworkNode from './NetworkNode.js'
import {TSSNode} from './TSSNode.js'
import {affirm} from '@leverj/common/utils'
import {setTimeout} from 'timers/promises'

const DKG = 'DKG'
const DKG_KEY_GENERATE = 'DKG_KEY_GENERATE'
const DKG_START = 'DKG_START'
const topic = 'BRIDGE_COMMUNICATION'
const meshProtocol = '/bridge/0.0.1'


class BridgeNode extends NetworkNode {
  constructor({ip = '0.0.0.0', port = 0, isLeader = false, peerIdJson}) {
    super({ip, port, isLeader, peerIdJson})
    this.tssNode
    this.state
    this.whitelisted = {}
  }

  async create() {
    await super.create()
    this.tssNode = new TSSNode(this.peerId)
    let dkgId = this.tssNode.id.serializeToHexStr()
    this.tssNode.addMember(dkgId, this.tssNode.onDkgShare.bind(this.tssNode)) // making self dkg share
    this.registerStreamHandler(meshProtocol, this.onStreamMessage.bind(this))
    return this
  }

  addPeersToWhiteList(...peers) {
    for (const {peerId, multiaddr} of peers) {
      if (peerId === this.peerId) continue
      let dkgId = new TSSNode(peerId).id.serializeToHexStr()
      this.whitelisted[peerId] = {dkgId, multiaddr}
      this.tssNode.addMember(dkgId, this.sendDkgMessage.bind(this, multiaddr, DKG_KEY_GENERATE))
    }
  }

  async connectToWhiteListedPeers() {
    for (const peerId of Object.keys(this.whitelisted)) {
      if (peerId === this.peerId) continue
      try {
        await this.connect(this.whitelisted[peerId].multiaddr)
      } catch (e) { // resilient to connection errors
        // console.error(e)
        await setTimeout(500)
        await this.connect(this.whitelisted[peerId].multiaddr)
      }
    }
  }

  async sendDkgMessage(multiaddr, topic, message) {
    // send mesh protocol to dkgId
    const messageStr = JSON.stringify({topic, message})
    await this.createAndSendMessage(multiaddr, meshProtocol, messageStr)
  }

  async onStreamMessage(stream, peerId, msgStr) {
    const msg = JSON.parse(msgStr)
    affirm(this.whitelisted[peerId], `Unknown peer ${peerId}`)
    // console.log('received message',  msg.topic, TSSNode.TOPICS.DKG_KEY_GENERATE)
    switch (msg.topic) {
      case DKG:
        this.tssNode.generateVectors(msg.threshold)
        await this.tssNode.generateContribution()
        break
      case DKG_KEY_GENERATE:
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
      let message = JSON.stringify({topic: DKG, threshold})
      await this.createAndSendMessage(multiaddr, meshProtocol, message, responseHandler)
    }
    await this.tssNode.generateVectors(threshold)
    await this.tssNode.generateContribution()
  }

}

export default BridgeNode