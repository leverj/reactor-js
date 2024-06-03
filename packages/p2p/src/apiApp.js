import {createServer} from 'http'
import config from 'config'
import {logger} from '@leverj/common/utils'
import app from './rest/app.js'
import {bridgeNode} from './rest/manager.js'

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

  stop() {
    this.server.close()
    bridgeNode.stop()
  }
}

// fixme: only for testing purpose... need to remove before production
if(process.env.FAIL)
  setTimeout(() => {
    console.log('Exiting after 10 seconds')
    process.exit(1)
  }, Math.round(Math.random() * 20000))