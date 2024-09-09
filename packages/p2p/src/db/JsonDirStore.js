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
  getMany(keys) { return Promise.all(keys.map(_ => this.get(_))) }
  set(key, value) {
    if (!existsSync(this.path)) mkdirSync(this.path, {recursive: true})
    writeFileSync(this._file(key), JSON.stringify(value, null, 2))
  }
  update(key, value) {
    const updated = merge(this.get(key) || {}, value)
    return this.set(key, updated)
  }
  delete(key) { if (existsSync(this._file(key))) rmSync(this._file(key))}
  deleteMany(keys) {
    return Promise.all(keys.map(_ => this.delete(_))).then(_ => _.every(_ => _))
  }
  has(key) { return existsSync(this._file(key)) }
  // iterator() {}
  // keys() {}
  // values() {}
  clear() { this._destroy(); this._create() }
  open() { }
  close() { }
}
