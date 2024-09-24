import {Map} from 'immutable'
import {merge} from 'lodash-es'
import {existsSync, readFileSync, writeFileSync} from 'node:fs'
import {ensureExistsSync} from './files.js'

export class InMemoryStore {
  constructor(prior = {}) { this.map = Map(prior).asMutable() }
  get(key, defaults) { return this.map.get(key, defaults) }
  set(key, value) { this.map.set(key, value) }
  update(key, value) { this.set(key, merge(this.get(key, {}), value)) }
  delete(key) { this.map.delete(key) }
  has(key) { return this.map.has(key) }
  entries() { return this.map.entries() }
  keys() { return this.map.keys() }
  values() { return this.map.values() }
  clear() { this.map.clear() }
  toObject() { return this.map.toJS() }
}

export class JsonStore {
  constructor(path, type) {
    ensureExistsSync(path)
    this.file = `${path}/${type}.json`
    this.cache = existsSync(this.file) ?
      new InMemoryStore(JSON.parse(readFileSync(this.file, 'utf8'))) :
      new InMemoryStore()
  }
  get exists() { return existsSync(this.file) }
  get(key, defaults) { return this.cache.get(key.toString(), defaults) }
  set(key, value) { this.cache.set(key.toString(), value); this.save() }
  update(key, value) { this.cache.update(key.toString(), value); this.save() }
  delete(key) { this.cache.delete(key.toString()); this.save() }
  has(key) { return this.cache.has(key.toString()) }
  entries() { return this.cache.entries() }
  keys() { return this.cache.keys() }
  values() { return this.cache.values() }
  clear() { this.cache.clear(); this.save() }
  toObject() { return this.cache.toObject() }
  save() { writeFileSync(this.file, JSON.stringify(this.toObject(), null, 2)) }
}
