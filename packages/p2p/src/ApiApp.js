import {logger} from '@leverj/common'
import {createServer} from 'http'
import {JsonDirStore} from './db/JsonDirStore.js'
import app from './rest/app.js'
import {setNode} from './rest/router.js'
import config from '../config.js'
import {events, INFO_CHANGED} from './utils.js'
import {BridgeNode} from './BridgeNode.js'

const {bridgeNode, port, ip} = config

const store = new JsonDirStore(bridgeNode.confDir, 'Info')

class Info {
  constructor(node, data) {
    this.node = node
    this.data = data
    this.timer = null
    events.on(INFO_CHANGED, () => this.set())
  }

  get() { return this.data }

  set() {
    if (this.timer) clearTimeout(this.timer)
    this.timer = setTimeout(async () => {
      if (this.data === this.node.info()) return
      this.data = this.node.info()
      store.set(this.node.port, this.data)
    }, 10)
  }
}

async function createNodeAt(port) {
  const data = store.get(port)
  const node = await BridgeNode.from(bridgeNode.port, bridgeNode.bootstrapNodes, data)
  new Info(node, data)
  await node.start()
  return node
}

export class ApiApp {
  static async new() {
    const node = await createNodeAt(port)
    setNode(node)
    return new this(node)
  }

  constructor(node) {
    this.node = node
    this.server = createServer(app)
  }

  start() {
    this.server.listen(port, ip, () => logger.log(`Bridge api server is running at port ${port}`))
  }

  async stop() {
    this.server.close()
    await this.node.stop()
  }
}
