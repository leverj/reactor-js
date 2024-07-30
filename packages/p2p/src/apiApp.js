import config from 'config'
import {createServer} from 'http'
import {logger} from '@leverj/common/utils'
import app from './rest/app.js'
import bridgeNode from './rest/manager.js'

const {port, ip} = config

export class ApiApp {
  constructor() {
    this.server = createServer(app)
  }

  start() {
    this.server.listen(port, ip, () =>
      logger.log(`Bridge api server  is running at port ${port}`),
    )
  }

  stop() {
    this.server.close()
    bridgeNode.stop()
  }
}
