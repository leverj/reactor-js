import NetworkNode from './NetworkNode.js'
import {TSSNode} from './TSSNode.js'
import {affirm} from '@leverj/common/utils'
import {setTimeout} from 'timers/promises'
import axios from 'axios'
import config from 'config'

const DKG_INIT_THRESHOLD_VECTORS = 'DKG_INIT_THRESHOLD_VECTORS'
const DKG_RECEIVE_KEY_SHARE = 'DKG_RECEIVE_KEY_SHARE'
const TSS_RECEIVE_SIGNATURE_SHARE = 'TSS_RECEIVE_SIGNATURE_SHARE'
const meshProtocol = '/bridgeNode/0.0.1'


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
  //FIXME this function will change a lot in future. For now, make simple assumptions
  //like http, external IP, good players.
  async joinBridgeRequest(bootstrapNode){
    const addPeerUrl = bootstrapNode + '/api/peer/add'
    const apiUrl = 'http://' + config.externalIp + ':' + config.port
    await axios.post(addPeerUrl, [{peerId: this.peerId, multiaddr:this.multiaddrs[0], requestorApiUrl: apiUrl}])
  }
  async addPeersToWhiteList(...peers) {
    for (const {peerId, multiaddr, requestorApiUrl} of peers) {
      if (peerId === this.peerId) continue
      let dkgId = new TSSNode(peerId).id.serializeToHexStr()
      this.whitelisted[peerId] = {dkgId, multiaddr, requestorApiUrl}
      this.tssNode.addMember(dkgId, this.sendMessageToPeer.bind(this, multiaddr, DKG_RECEIVE_KEY_SHARE))
    }
    if (!this.isLeader) return;
    for (const {requestorApiUrl, peerId} of Object.values(this.whitelisted)) {
      const addPeerUrl = requestorApiUrl + '/api/peer/add'
      const outArr = []
      for (const peerId of Object.keys(this.whitelisted)){
        outArr.push({
          peerId, multiaddr: this.whitelisted[peerId].multiaddr, requestorApiUrl: this.whitelisted[peerId].requestorApiUrl
        })
      }
      outArr.push({peerId: this.peerId, multiaddr: this.multiaddrs[0], requestorApiUrl: 'http://' + config.externalIp + ':' + config.port})
      await axios.post(addPeerUrl, outArr)
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