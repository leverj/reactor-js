import config from 'config'
import {existsSync, readFileSync, writeFileSync} from 'node:fs'
import path from 'path'
import {BridgeNode} from '../BridgeNode.js'
import {events, INFO_CHANGED} from '../utils/index.js'

const {bridgeNode} = config

class Info {
  constructor() {
    this.filePath = path.join(bridgeNode.confDir, 'info.json')
    this.timer = null
    this.data = this.get()
    events.on(INFO_CHANGED, () => this.set())
  }

  setNode(node) { this.node = node }

  get() {
    if (this.data) return this.data
    if (!existsSync(this.filePath)) return
    this.data = JSON.parse(readFileSync(this.filePath, 'utf8'))
    return this.data
  }

  set() {
    if (this.timer) clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      if (this.data === this.node.exportJson()) return
      this.data = this.node.exportJson()
      writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf8')
    }, 10)
  }
}
const info = new Info()

const {port, isLeader, bootstrapNodes} = bridgeNode
const manager = await BridgeNode.from({port, isLeader, bootstrapNodes, json: info.get()})
info.setNode(manager)
await manager.start()

export default manager
