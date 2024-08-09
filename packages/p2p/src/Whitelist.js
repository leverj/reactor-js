import {SecretKey} from '@leverj/reactor.mcl'

function generateDkgId(id) {
  const key = new SecretKey()
  key.setHashOf(Buffer.from(id))
  return key.serializeToHexStr()
}

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
