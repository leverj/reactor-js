import config from 'config'
import {existsSync, readFileSync, writeFileSync, mkdirSync} from 'node:fs'
import {BridgeNode} from '../BridgeNode.js'
import {events, INFO_CHANGED} from '../utils/index.js'

const {bridgeNode: {port, bootstrapNodes}} = config

const e2ePath = `${process.cwd()}/../../data/.e2e`
const dirPath = (port) => `${e2ePath}/${port}`
const filePath = (port) => `${dirPath(port)}/info.json`
const getInfo = (port) => existsSync(filePath(port)) ? JSON.parse(readFileSync(filePath(port)).toString()) : undefined
const setInfo = (port, info) => {
  if (!existsSync(dirPath(port))) mkdirSync(dirPath(port), {recursive: true})
  writeFileSync(filePath(port), JSON.stringify(info))
}

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
      setInfo(config.port, this.data)
    }, 10)
  }
}

const data = getInfo(config.port)
const manager = await BridgeNode.from(port, bootstrapNodes, data)
new Info(manager, data)
await manager.start()

export default manager
