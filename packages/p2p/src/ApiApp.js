import {ensureExistsSync, logger} from '@leverj/common'
import {createServer} from 'http'
import {existsSync, readFileSync, writeFileSync} from 'node:fs'
import {createApp} from './rest/app.js'
import {BridgeNode} from './BridgeNode.js'
import {events, NODE_INFO_CHANGED} from './utils.js'


export class JsonDirStore {
  constructor(path, type) {
    this.path = `${path}/${type}`
    ensureExistsSync(this.path)
  }

  fileOf(key) { return `${this.path}/${key}.json` }

  get(key) { return existsSync(this.fileOf(key)) ? JSON.parse(readFileSync(this.fileOf(key)).toString()) : undefined }

  set(key, value) { writeFileSync(this.fileOf(key), JSON.stringify(value, null, 2)) }
}

class NodePersistence {
  constructor(name, node, store) {
    this.name = name
    this.node = node
    this.store = store
    events.on(NODE_INFO_CHANGED, () => this.set())
  }

  get() { return this.store.get(this.name) }

  set() {
    if (this.timer) clearTimeout(this.timer)
    this.timer = setTimeout(() => this.store.set(this.name, this.node.info()), 10)
  }
}

export class ApiApp {
  static async new(config) {
    const {bridge} = config
    const store = new JsonDirStore(bridge.nodesDir, 'nodes')
    const node = await BridgeNode.from(config, bridge.port, bridge.bootstrapNodes, store.get(config.port))
    new NodePersistence(config.port, node, store) // ... start listening to NODE_INFO_CHANGED
    await node.start()
    return new this(config, node)
  }

  constructor(config, node) {
    this.port = config.port
    this.ip = config.ip
    this.node = node
    this.app = createApp(config, node)
    this.server = createServer(this.app)
  }

  start() {
    this.server.listen(this.port, this.ip, () => logger.log(`Bridge api server is running at port ${this.port}`))
  }

  async stop() {
    await this.node.stop()
    const promise = new Promise((resolve, reject) => this.server.close(function (err) {
      if (err) reject(err)
      else resolve()
    }))
    await promise
  }
}
