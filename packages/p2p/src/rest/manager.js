import config from '../../config.js'
import {BridgeNode} from '../BridgeNode.js'
import {events, INFO_CHANGED} from '../utils.js'
import {JsonDirStore} from '../db/JsonDirStore.js'

const {bridge, port} = config

const store = new JsonDirStore(bridge.confDir, 'Info')

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
      store.set(port, this.data)
    }, 10)
  }
}

const data = store.get(port)
const manager = await BridgeNode.from(bridge.port, bridge.bootstrapNodes, data)
new Info(manager, data)
await manager.start()

export default manager
