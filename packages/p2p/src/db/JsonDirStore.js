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

  async get(key, defaults) { return await this.has(key) ? this._get(key) : defaults }
  async getMany(keys) { return Promise.all(keys.map(async _ => this.get(_))) }
  async set(key, value) {
    if (!existsSync(this.path)) mkdirSync(this.path, {recursive: true})
    writeFileSync(this._file(key), JSON.stringify(value, null, 2))
  }
  async update(key, value) {
    const updated = merge(await super.get(key) || {}, value)
    return this.set(key, updated)
  }
  async delete(key) { if (existsSync(this._file(key))) rmSync(this._file(key))}
  async deleteMany(keys) {
    return Promise.all(keys.map(_ => this.delete(_))).then(_ => _.every(_ => _))
  }
  async has(key) { return existsSync(this._file(key)) }
  // iterator() {}
  // keys() {}
  // values() {}
  async clear() { this._destroy(); this._create() }
  async open() { }
  async close() { }
}
