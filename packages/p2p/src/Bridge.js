import Node from './Node.js'
import {DistributedKey} from './DistributedKey.js'
import {affirm} from '@leverj/common/utils'

const DKG = 'DKG'
const DKG_START = 'DKG_START'
const topic = 'BRIDGE_COMMUNICATION'
const meshProtocol = '/bridge/0.0.1'
import {setTimeout} from 'timers/promises'

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

  onStreamMessage(stream, peerId, msgStr) {
    const msg = JSON.parse(msgStr)
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
    //JSON.stringify returning only type token. weird.
    const messageToSend = `{\"type\": \"DKG\", \"threshold\": \"${threshold}\"}`
    for (const peer of this.peers) {
      const stream = await this.createStream(this.p2pNetwork[peer].multiaddrs[0], meshProtocol);
      await this.sendMessage(stream, messageToSend)
      await this.p2pNetwork[peer].readStream(stream, (msg) => {console.log("Read Stream", msg)})
    }
  }

}

export default Bridge