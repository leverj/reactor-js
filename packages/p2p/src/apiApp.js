import {createServer} from 'http'
import config from 'config'
import {logger} from '@leverj/common/utils'
import app from './rest/app.js'
import {bridgeNode} from './rest/manager.js'
import axios from 'axios'
import {tryAgainIfConnectionError} from './utils.js'
const {port, ip, externalIp, bridgeNode:{port: bridgePort}} = config
const meshProtocol = '/bridgeNode/0.0.1' //FIXXME This needs to be a global constant
 
export class ApiApp {
  constructor() {
    this.server = createServer(app)
  }

  start() {
    this.server.listen(port, ip, () =>
      logger.log(`Bridge api server  is running at port ${port}`)
    )
  }
  async connectToLeader(){
    const leaderUrl = config.bridgeNode.bootstrapNode + '/api/peer/add'
    const peerId = bridgeNode.peerId
    const multiaddr = `/ip4/${externalIp}/tcp/${bridgePort}/p2p/${peerId}`
    try {
      await tryAgainIfConnectionError(async () => axios.post(leaderUrl, [{peerId, multiaddr, ip: externalIp, port}]))
    } catch (e) {
      logger.error('Error connecting to leader', e)
    }
    if (bridgeNode.isLeader)return;
    try{
      const leaderInfoUrl = config.bridgeNode.bootstrapNode + '/api/info'
      const {data: leaderInfo} = await axios.get(leaderInfoUrl)
      await bridgeNode.connect(leaderInfo.whitelistedPeers[leaderInfo.p2p.id].multiaddr)
      await bridgeNode.connectPubSub(
        leaderInfo.p2p.id, async function({peerId, topic, data}){
          const dataObj = JSON.parse(data)
          const signature = await bridgeNode.tssNode.sign(dataObj.message)
          const signaturePayloadToLeader = {topic: 'TSS_RECEIVE_SIGNATURE_SHARE',signature: signature.serializeToHexStr(), signer: bridgeNode.tssNode.id.serializeToHexStr(), txnHash: dataObj.txnHash}
          await bridgeNode.createAndSendMessage(leaderInfo.whitelistedPeers[leaderInfo.p2p.id].multiaddr, meshProtocol, JSON.stringify(signaturePayloadToLeader), (msg) => { console.log("SignaruePayload Ack", msg) })
        }
      )
      await bridgeNode.subscribe('Signature')
    }
    catch(e){
      logger.error('Error subscribing to leader topic', e)
    }
  }
  stop() {
    this.server.close()
    bridgeNode.stop()
  }
}
