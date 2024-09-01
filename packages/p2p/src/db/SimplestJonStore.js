import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs'
import {merge} from 'lodash-es'

export class SimplestJsonStore {
  constructor(path, type) {
    if (!existsSync(path)) mkdirSync(path, {recursive: true})
    this.file = `${path}/${type}.json`
    this.cache = new Map()
    if (existsSync(this.file)) {
      const data = JSON.parse(readFileSync(this.file).toString().trim())
      this.cache = new Map(Object.entries(data))
    }
  }
  get(key, defaults = undefined) { return this.cache.get(key) || defaults }
  set(key, value) { this.cache.set(key, value); this._save_() }
  update(key, value) { this.set(key, merge(this.get(key, {}), value)) }
  delete(key) { this.cache.delete(key); this._save_() }
  has(key) { return this.cache.has(key) }
  iterator() { return this.cache.entries() }
  keys() { return this.cache.keys() }
  values() { return this.cache.values() }
  clear() { this.cache.clear(); this._save_() }
  _save_() {
    const data = Object.fromEntries(this.cache)
    writeFileSync(this.file, JSON.stringify(data, null, 2), 'utf-8')
  }
}
