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
      let dkgId = new DistributedKey(peerId).id.serializeToHexStr()
      this.whitelisted[peerId] = {dkgId: dkgId, multiaddr}
      this.distributedKey.addMember(dkgId, this.sendDkgMessage.bind(this, multiaddr))
    }
  }

  async connectWhitelisted() {
    for (const peerId of Object.keys(this.whitelisted)) {
      if (peerId === this.peerId) continue
      await this.connect(this.whitelisted[peerId].multiaddr)
      await setTimeout(100)
    }
  }

  async create() {
    await super.create()
    console.log(JSON.stringify(this.exportPeerId()))
    this.distributedKey = new DistributedKey(this.peerId)
    this.registerStreamHandler(meshProtocol, this.onStreamMessage.bind(this))
    return this
  }

  async sendDkgMessage(multiaddr, topic, message) {
    // send mesh protocol to dkgId
    const messageStr = JSON.stringify({topic, message})
    await this.createAndSendMessage(multiaddr, meshProtocol, messageStr)
  }

  async onStreamMessage(stream, peerId, msgStr) {
    console.log('onStreamMessage', peerId, msgStr)
    const msg = JSON.parse(msgStr)
    affirm(this.whitelisted[peerId], `Unknown peer ${peerId}`)

    switch (msg.topic) {
      case DKG:
        this.distributedKey.generateVectors(msg.threshold)
        await this.distributedKey.generateContribution()
        break
      case this.distributedKey.TOPICS.DKG_KEY_GENERATE:
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