import path from 'path'
import config from 'config'
import events, {INFO_CHANGED} from '../events.js'
import {existsSync, readFileSync, writeFileSync} from 'node:fs'

export class Info {
  constructor() {
    this.filePath = path.join(config.bridgeNode.confDir, 'info.json')
    this.timer = null
    this.info = this.get()
    events.on(INFO_CHANGED, () => this.set())
  }

  setBridgeNode(bridgeNode) { this.bridgeNode = bridgeNode }

  get() {
    if (this.info) return this.info
    if (!existsSync(this.filePath)) return
    this.info = JSON.parse(readFileSync(this.filePath, 'utf8'))
    return this.info
  }

  set() {
    if (this.timer) clearTimeout(this.timer)
    this.timer = setTimeout(() => this._write(), 100)
  }

  _write() {
    if (this.info === this.bridgeNode.exportJson()) return
    this.info = this.bridgeNode.exportJson()
    writeFileSync(this.filePath, JSON.stringify(this.info, null, 2), 'utf8')
  }
}

