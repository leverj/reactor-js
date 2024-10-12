import {ensureExistsSync, logger} from '@leverj/lever.common'
import {createServer} from 'http'
import {existsSync, readFileSync, writeFileSync} from 'node:fs'
import {createApp} from './rest/app.js'
import {BridgeNode} from './BridgeNode.js'
import {events, NODE_STATE_CHANGED} from './events.js'

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
  constructor(name, node, store) {
    this.name = name
    this.node = node
    this.store = store
    events.on(NODE_STATE_CHANGED, () => this.set())
  }
  get() { return this.store.get(this.name) }
  set() {
    if (this.timer) clearTimeout(this.timer)
    this.timer = setTimeout(() => this.store.set(this.name, this.node.state()), 10)
  }
}

export class ApiApp {
  static async with(config, store) {
    const {bridge, port} = config
    const node = await BridgeNode.from(config, bridge.port, bridge.bootstrapNodes, store.get(port))
    new NodePersistence(port, node, store) // ... start listening to NODE_STATE_CHANGED
    return new this(config, node)
  }

  constructor(config, node) {
    this.port = config.port
    this.ip = config.ip
    this.node = node
    this.app = createApp(config, node)
    this.server = createServer(this.app)
  }

  async start() {
    await this.node.start()
    this.server.listen(this.port, this.ip, () => logger.log(`Bridge api server is running at port ${this.port}`))
    return this
  }

  async stop() {
    this.server.close()
    await this.node.stop()
  }
}
