import config from 'config'
import {existsSync, readFileSync, writeFileSync} from 'node:fs'
import path from 'path'
import {BridgeNode} from '../BridgeNode.js'
import {Transfer} from '../Transfer.js'
import {events, INFO_CHANGED} from '../utils/index.js'

class Info {
  constructor() {
    this.filePath = path.join(config.bridgeNode.confDir, 'info.json')
    this.timer = null
    this.data = this.get()
    events.on(INFO_CHANGED, () => this.set())
  }

  setNode(node) {
    this.node = node
  }

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


const {bridgeNode: {port, isLeader, bootstrapNodes}} = config
const info = new Info()
const node = await BridgeNode.from({port, isLeader, json: info.get(), bootstrapNodes})
node.setTransfer(new Transfer(node))
info.setNode(node)
await node.start()

export default node
