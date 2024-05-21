import {createServer} from 'http'
import config from 'config'
import {logger} from '@leverj/common/utils'
import app from './rest/app.js'
import {bridgeNode} from './rest/manager.js'
import axios from 'axios'
import {tryAgainIfConnectionError, tryAgainIfEncryptionFailed, waitToSync} from './utils.js'
import {SIGNATURE_START} from './BridgeNode.js'

const {port, ip, externalIp, bridgeNode: {port: bridgePort}} = config

export class ApiApp {
  constructor() {
    this.server = createServer(app)
  }

  start() {
    this.server.listen(port, ip, () =>
      logger.log(`Bridge api server  is running at port ${port}`)
    )
  }

  // fixme: move to bridgeNode after kad-dht node discovery is implemented
  async connectToLeader() {
    const leaderUrl = config.bridgeNode.bootstrapNode + '/api/peer/add'
    const peerId = bridgeNode.peerId
    const multiaddr = `/ip4/${externalIp}/tcp/${bridgePort}/p2p/${peerId}`
    await tryAgainIfConnectionError(async () => await axios.post(leaderUrl, [{peerId, multiaddr, ip: externalIp, port}]))
    if (bridgeNode.isLeader) return
    const leaderInfoUrl = config.bridgeNode.bootstrapNode + '/api/info'
    const {data: leaderInfo} = await axios.get(leaderInfoUrl)
    await tryAgainIfEncryptionFailed(async ()=> await bridgeNode.connect(leaderInfo.whitelistedPeers[leaderInfo.p2p.id].multiaddr))
    await bridgeNode.connectPubSub(leaderInfo.p2p.id)
    await bridgeNode.subscribe(SIGNATURE_START)
  }

  stop() {
    this.server.close()
    bridgeNode.stop()
  }
}
