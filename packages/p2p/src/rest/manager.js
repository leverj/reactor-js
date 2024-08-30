import config from 'config'
import {BridgeNode} from '../BridgeNode.js'
import {Store} from '../db/Store.js'
import {events, INFO_CHANGED} from '../utils.js'

const {bridgeNode, port} = config

const store = await Store.Json(bridgeNode.confDir, 'Info')

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
      await store.set(port, this.data)
    }, 10)
  }
}

const data = await store.get(port)
const manager = await BridgeNode.from(bridgeNode.port, bridgeNode.bootstrapNodes, data)
new Info(manager, data)
await manager.start()

export default manager
