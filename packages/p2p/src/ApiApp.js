import {logger} from '@leverj/common'
import {createServer} from 'http'
import config from '../config.js'
import app from './rest/app.js'
import manager from './rest/manager.js'

const {port, ip} = config

export class ApiApp {
  constructor() {
    this.server = createServer(app)
  }

  start() {
    this.server.listen(port, ip, () => logger.log(`Bridge api server is running at port ${port}`))
  }

  async stop() {
    this.server.close()
    return manager.stop()
  }
}
