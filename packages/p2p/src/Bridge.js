import Node from './Node.js'
import {DistributedKey} from './DistributedKey.js'
import {affirm} from '@leverj/common/utils'
import {setTimeout} from 'timers/promises'

const DKG = 'DKG'
const DKG_START = 'DKG_START'
const topic = 'BRIDGE_COMMUNICATION'
const meshProtocol = '/bridge/0.0.1'


class Bridge extends Node {
  constructor({ip = '0.0.0.0', port = 0, isLeader = false, peerIdJson}) {
    super({ip, port, isLeader, peerIdJson})
    this.distributedKey
    this.state
    this.whitelisted = {}
  }

  whitelistPeers(...peers) {
    for (const {peerId, multiaddr} of peers) {
      if(peerId === this.peerId) continue
      let dkgId = new DistributedKey(peerId).id.serializeToHexStr()
      this.whitelisted[peerId] = {dkgId, multiaddr}
      this.distributedKey.addMember(dkgId, this.sendDkgMessage.bind(this, multiaddr))
    }
  }

  async connectWhitelisted() {
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

  async create() {
    await super.create()
    this.distributedKey = new DistributedKey(this.peerId)
    let dkgId = this.distributedKey.id.serializeToHexStr()
    this.distributedKey.addMember(dkgId, this.distributedKey.onMessage.bind(this.distributedKey))
    this.registerStreamHandler(meshProtocol, this.onStreamMessage.bind(this))
    return this
  }

  async sendDkgMessage(multiaddr, topic, message) {
    // send mesh protocol to dkgId
    const messageStr = JSON.stringify({topic, message})
    await this.createAndSendMessage(multiaddr, meshProtocol, messageStr)
  }

  async onStreamMessage(stream, peerId, msgStr) {
    const msg = JSON.parse(msgStr)
    affirm(this.whitelisted[peerId], `Unknown peer ${peerId}`)
    // console.log('received message',  msg.topic, DistributedKey.TOPICS.DKG_KEY_GENERATE)
    switch (msg.topic) {
      case DKG:
        this.distributedKey.generateVectors(msg.threshold)
        await this.distributedKey.generateContribution()
        break
      case DistributedKey.TOPICS.DKG_KEY_GENERATE:
        // console.log('received message',  msg.topic)
        this.distributedKey.onMessage(msg.topic, msg.message)
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
    await this.distributedKey.generateVectors(threshold)
    await this.distributedKey.generateContribution()
  }

}

export default Bridge