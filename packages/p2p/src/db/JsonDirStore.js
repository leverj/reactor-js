import {merge} from 'lodash-es'
import {existsSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs'

export class JsonDirStore {
  constructor(path, type) {
    this.path = `${path}/${type}`
    this._create()
  }

  _file(key) { return `${this.path}/${key}.json` }
  _get(key) { return JSON.parse(readFileSync(this._file(key)).toString()) }
  _create() { if (!existsSync(this.path)) mkdirSync(this.path, {recursive: true}) }
  _destroy() { rmSync(this.path, {recursive: true, force: true}) }

  get(key, defaults) { return this.has(key) ? this._get(key) : defaults }
  set(key, value) {
    if (!existsSync(this.path)) mkdirSync(this.path, {recursive: true})
    writeFileSync(this._file(key), JSON.stringify(value, null, 2))
  }
  update(key, value) {
    const updated = merge(this.get(key) || {}, value)
    return this.set(key, updated)
  }
  has(key) { return existsSync(this._file(key)) }
  clear() { this._destroy(); this._create() }
}
