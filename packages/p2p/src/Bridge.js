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
      this.whitelisted[peerId] = {dkgId: new DistributedKey(peerId).id, multiaddr}
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
    this.distributedKey = new DistributedKey(this.peerId)
    this.registerStreamHandler(meshProtocol, this.onStreamMessage.bind(this))
    return this
  }

  onStreamMessage(stream, peerId, msgStr) {
    const msg = JSON.parse(msgStr)
    affirm(this.whitelisted[peerId], `Unknown peer ${peerId}`)

    switch (msg.type) {
      case DKG:
        this.distributedKey.generateVectors(msg.threshold)
        this.distributedKey.generateContribution()
        break
    }
  }

  async startDKG(threshold) {
    if (!this.isLeader) return
    const responseHandler = (msg) => {
      console.log('Read Stream', msg)
    }
    for (const peerId of Object.keys(this.whitelisted)) {
      if (this.peerId === peerId) continue
      let multiaddr = this.whitelisted[peerId].multiaddr
      let message = JSON.stringify({type: DKG, threshold})
      await this.createAndSendMessage(multiaddr, meshProtocol, message, responseHandler)
    }
    await this.distributedKey.generateVectors(threshold)
    await this.distributedKey.generateContribution()
  }

}

export default Bridge