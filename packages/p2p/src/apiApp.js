import {createServer} from 'http'
import app from './rest/app.js'

export class ApiApp {
  constructor() {
    this.server = createServer(app)
  }

  start() {
    this.server.listen(port, appIP, () =>
      logger.log(`marketplace-server [api/v1] is running at port ${port}\n\t - go to http://localhost:${port}/api/v1/graphql to run GraphQL queries!`)
    )
  }

  stop() {
    this.server.close()
  }
}
