import {ensureExistsSync, logger} from '@leverj/common'
import {createServer} from 'http'
import {existsSync, readFileSync, writeFileSync} from 'node:fs'
import config from '../config.js'
import app from './rest/app.js'
import {setNode} from './rest/router.js'
import {BridgeNode} from './BridgeNode.js'
import {events, NODE_INFO_CHANGED} from './utils.js'

const {bridge, port, ip} = config

export class JsonDirStore {
  constructor(path, type) {
    this.path = `${path}/${type}`
    ensureExistsSync(this.path)
  }
  fileOf(key) { return `${this.path}/${key}.json` }
  get(key) { return existsSync(this.fileOf(key)) ? JSON.parse(readFileSync(this.fileOf(key), 'utf8')) : undefined }
  set(key, value) { writeFileSync(this.fileOf(key), JSON.stringify(value, null, 2)) }
}

class NodePersistence {
  constructor(node, store) {
    this.node = node
    this.store = store
    events.on(NODE_INFO_CHANGED, () => this.set())
  }
  get() { return this.store.get(port) }
  //fixme: port is referenced directly, rather than node.network.port (which will fail... )
  set() {
    if (this.timer) clearTimeout(this.timer)
    this.timer = setTimeout(() => this.store.set(port, this.node.info()), 10)
  }
}

export class ApiApp {
  static async new() {
    const store = new JsonDirStore(bridge.nodesDir, 'nodes')
    const node = await BridgeNode.from(bridge.port, bridge.bootstrapNodes, store.get(port))
    new NodePersistence(node, store) // ... start listening to NODE_INFO_CHANGED
    await node.start()
    setNode(node) // hack: make it available to router
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
