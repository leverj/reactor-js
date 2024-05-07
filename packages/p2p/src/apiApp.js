import {createServer} from 'http'
import config from 'config'
import {logger} from '@leverj/common/utils'
import app from './rest/app.js'
import {bridgeNode} from './rest/bridgeInfo.js'
import axios from 'axios'
const {port, ip} = config

export class ApiApp {
  constructor() {
    this.server = createServer(app)
  }

  start() {
    this.server.listen(port, ip, () =>
      logger.log(`Bridge api server  is running at port ${port}`)
    )
  }
  async connectToBridge(){
    const addPeerUrl = config.bridgeNode.bootstrapNode + '/api/peer/add'
    const multiaddr = `/ip4/${config.externalIp}/tcp/${config.bridgeNode.port}/p2p/${bridgeNode.peerId}`
    await axios.post(addPeerUrl, [{peerId: bridgeNode.peerId, multiaddr, ip: config.externalIp, port: config.port}])
  }
  stop() {
    this.server.close()
    bridgeNode.stop()
  }
}
