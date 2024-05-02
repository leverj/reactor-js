import NetworkNode from './NetworkNode.js'
import {TSSNode} from './TSSNode.js'
import {affirm} from '@leverj/common/utils'
import {setTimeout} from 'timers/promises'
import axios from 'axios'

const DKG_INIT_THRESHOLD_VECTORS = 'DKG_INIT_THRESHOLD_VECTORS'
const DKG_RECEIVE_KEY_SHARE = 'DKG_RECEIVE_KEY_SHARE'
const TSS_RECEIVE_SIGNATURE_SHARE = 'TSS_RECEIVE_SIGNATURE_SHARE'
const meshProtocol = '/bridge/0.0.1'


class BridgeNode extends NetworkNode {
  constructor({ip = '0.0.0.0', port = 0, isLeader = false, json}) {
    super({ip, port, isLeader, peerIdJson: json?.p2p})
    this.tssNode
    this.state
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
    this.tssNode = new TSSNode(this.peerId)
    let dkgId = this.tssNode.id.serializeToHexStr()
    this.tssNode.addMember(dkgId, this.tssNode.onDkgShare.bind(this.tssNode)) // making self dkg share
    this.registerStreamHandler(meshProtocol, this.onStreamMessage.bind(this))
    return this
  }
  //Each node on start will send request to boostrap node(s), which will add it to its whitelist
  //and send back list of peers, then individual whitelisted nodes can add to their whitelist
  //OR we can assume that Bootstrap holds a global address book. whenever new joins, it is broadcasted to all
  //instead of a cascading discovery (which could be done later)
  async sendFriendRequest(bootstrapNodes){
    //for now assume one healthy bootstrap. Later this could come by doing a health status check
    //on the list and whichever is healthy can be used
    //IF already whitelisted then simply return
    //Boostrap node can potentially synchronize a new node across all whitelisted ones 
    const healthyBootstrapNode = bootstrapNodes[0]
    const addPeerUrl = healthyBootstrapNode.url + '/api/peer/add'
    await axios.post(addPeerUrl, {peerId: this.peerId, multiaddr:this.multiaddrs[0]})
    //await setTimeout(5000)
  }
  addPeersToWhiteList(...peers) {
    for (const {peerId, multiaddr} of peers) {
      if (peerId === this.peerId) continue
      let dkgId = new TSSNode(peerId).id.serializeToHexStr()
      this.whitelisted[peerId] = {dkgId, multiaddr}
      this.tssNode.addMember(dkgId, this.sendMessageToPeer.bind(this, multiaddr, DKG_RECEIVE_KEY_SHARE))
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

  async sendMessageToPeer(multiaddr, topic, message) {
    // send mesh protocol to dkgId
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