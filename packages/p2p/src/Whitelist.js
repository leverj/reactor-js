import {generateDkgId} from './TSSNode.js'

export default class Whitelist {
  constructor(json) {
    this.allowed = {}
    this.json = json
    this.canPublish = false
  }

  exists(peerId) { return this.allowed[peerId] }

  add(peerId) {
    this.allowed[peerId] = generateDkgId(peerId)
    return this.allowed[peerId]
  }

  get() { return Object.keys(this.allowed) }

  exportJson() { return this.get()}
}