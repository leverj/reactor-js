import {existsSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs'
import {KeyvFile} from 'keyv-file'

export class KeyvJsonStore extends KeyvFile {
  constructor(path, type, options = {writeDelay: 100}) {
    super(Object.assign({filename: `${path}/${type}.json`}, options))
  }
}

export class JsonStore {
  constructor(path, type) {
    this.path = `${path}/${type}`
    this.create()
  }

  location(key) { return `${this.path}/${key}.json` }
  has(key) { return existsSync(this.location(key)) }
  get(key, force = false) { return force || this.has(key) ? JSON.parse(readFileSync(this.location(key)).toString()) : undefined }
  set(key, value) {
    if (!existsSync(this.path)) mkdirSync(this.path, {recursive: true})
    writeFileSync(this.location(key), JSON.stringify(value, null, 2))
  }
  create() {  if (!existsSync(this.path)) mkdirSync(this.path, {recursive: true}) }
  destroy() { rmSync(this.path, {recursive: true, force: true}) }
  clear() { this.destroy(); this.create() }
}
