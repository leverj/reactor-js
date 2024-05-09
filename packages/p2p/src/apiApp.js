import {createServer} from 'http'
import config from 'config'
import {logger} from '@leverj/common/utils'
import app from './rest/app.js'
import {bridgeNode} from './rest/manager.js'
import axios from 'axios'
const {port, ip, externalIp, bridgeNode:{port: bridgePort}} = config

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
    await axios.post(leaderUrl, [{peerId, multiaddr, ip: externalIp, port}])
  }
  stop() {
    this.server.close()
    bridgeNode.stop()
  }
}
