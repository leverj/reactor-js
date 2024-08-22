import config from 'config'
import JSONStore from 'json-store'
import {existsSync, readFileSync, writeFileSync, mkdirSync} from 'node:fs'
import {BridgeNode} from '../BridgeNode.js'
import {events, INFO_CHANGED} from '../utils/index.js'

const {bridgeNode: {confDir, port, bootstrapNodes}} = config
mkdirSync(confDir, {recursive: true})
const infoFile = `${confDir}/info.json`
const store = JSONStore(infoFile)

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
    this.timer = setTimeout(() => {
      if (this.data === this.node.info()) return
      this.data = this.node.info()
      writeFileSync(infoFile, JSON.stringify(this.data))
      // store.set(0, this.data)
    }, 10)
  }
}

const data = existsSync(infoFile) ? JSON.parse(readFileSync(infoFile, 'utf8')) : undefined
// const data = store.get(0)
const manager = await BridgeNode.from(port, bootstrapNodes, data)
new Info(manager, data)
await manager.start()

export default manager
