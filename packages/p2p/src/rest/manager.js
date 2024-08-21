import config from 'config'
import {existsSync, readFileSync, writeFileSync} from 'node:fs'
import path from 'path'
import {BridgeNode} from '../BridgeNode.js'
import {events, INFO_CHANGED} from '../utils/index.js'

const {bridgeNode: {confDir, port, bootstrapNodes}} = config
const infoFile = path.join(confDir, 'info.json')
const json = existsSync(infoFile) ? JSON.parse(readFileSync(infoFile, 'utf8')) : undefined

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
      if (this.data === this.node.exportJson()) return
      this.data = this.node.exportJson()
      writeFileSync(infoFile, JSON.stringify(this.data, null, 2), 'utf8')
    }, 10)
  }
}

const manager = await BridgeNode.from({port, bootstrapNodes, json})
new Info(manager, json)
await manager.start()

export default manager
