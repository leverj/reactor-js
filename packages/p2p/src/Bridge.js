import Node from './Node.js'
import {DistributedKey} from './DistributedKey.js'
import {affirm} from '@leverj/common/utils'

const DKG = 'DKG'
const DKG_START = 'DKG_START'
const topic = 'BRIDGE_COMMUNICATION'
const meshProtocol = '/bridge/0.0.1'

class Bridge extends Node {
  constructor({ip = '0.0.0.0', port = 0, isLeader = false, peerIdJson}) {
    super({ip, port, isLeader, peerIdJson})
    this.distributedKey
    this.state
    this.peersMap = {}
  }

  addToKnownPeers(...peerIds) {
    for (const peerId of peerIds) this.peersMap[peerId] = {dkgId: new DistributedKey(peerId).id}
    super.addToKnownPeers(...peerIds)
  }

  async create() {
    await super.create()
    this.distributedKey = new DistributedKey(this.peerId)
    this.registerStreamHandler(meshProtocol, this.onStreamMessage.bind(this))
    return this
  }

  onStreamMessage(stream, peerId, msg) {
    affirm(this.knownPeers[peerId], `Unknown peer ${peerId}`)
    switch (msg.type) {
      case DKG:
        this.distributedKey.generateVectors(msg.threshold)
        this.distributedKey.generateContribution()
        break
    }
  }

  /*
  for (const member of members) member.generateVectors(threshold)
  for (const member of members) member.generateContribution()
  for (const member of members) member.dkgDone()
   */

  async startDKG(threshold) {
    if (!this.isLeader) return
    for (const peer of this.peers) {
      this.createAndSendMessage(peer, meshProtocol, JSON.stringify({type: DKG, threshold}), () => {})
    }
  }

}

export default Bridge