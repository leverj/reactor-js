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

  async get(key, force = false) { return force || await this.has(key) ? this._get(key) : undefined } //fixme: remove the need for 'force'
  // async getMany(keys) { return [] }
  async set(key, value) {
    if (!existsSync(this.path)) mkdirSync(this.path, {recursive: true})
    writeFileSync(this._file(key), JSON.stringify(value, null, 2))
  }
  async update(key, value) {
    const update = merge(await super.get(key) || {}, value)
    return this.set(key, update)
  }
  async delete(key) { if (existsSync(this._file(key))) rmSync(this._file(key))}
  // async deleteMany(keys) { }
  async has(key) { return existsSync(this._file(key)) }
  // iterator() {}
  // keys() {}
  // values() {}
  async clear() { this._destroy(); this._create() }
  async open() { }
  async close() { }
}
