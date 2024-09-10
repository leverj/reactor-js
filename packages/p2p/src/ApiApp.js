import {logger} from '@leverj/common'
import {createServer} from 'http'
import {JsonDirStore} from './db/JsonDirStore.js'
import app from './rest/app.js'
import {setNode} from './rest/router.js'
import config from '../config.js'
import {events, INFO_CHANGED} from './utils.js'
import {BridgeNode} from './BridgeNode.js'

const {bridge, port, ip} = config

class NodeStorage {
  constructor(node, store) {
    this.node = node
    this.store = store
    this.timer = null
    events.on(INFO_CHANGED, () => this.set())
  }

  get data() { return this.store.get(this.node.port) }
  set data(value) { if (this.data !== value) this.store.set(this.node.port, value) }

  get() { return this.data }
  set() {
    if (this.timer) clearTimeout(this.timer)
    this.timer = setTimeout(() => this.data = this.node.info(), 10)
  }
}

export class ApiApp {
  static async new() {
    const store = new JsonDirStore(bridge.confDir, 'nodes')
    const node = await BridgeNode.from(bridge.port, bridge.bootstrapNodes, store.get(port))
    new NodeStorage(node, store)
    await node.start()
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
