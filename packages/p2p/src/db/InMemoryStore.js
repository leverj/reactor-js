import {Map} from 'immutable'
import {merge} from 'lodash-es'

export class InMemoryStore {
  constructor() { this.map = Map().asMutable() }
  get(key, defaults) { return this.map.get(key, defaults) }
  getMany(keys) { return keys.map(_ => this.get(_, undefined)) }
  set(key, value) { this.map.set(key, value) }
  update(key, value) { this.set(key, merge(this.get(key, {}), value)) }
  delete(key) { this.map.delete(key) }
  deleteMany(keys) { keys.map(_ => this.delete(_)) }
  has(key) { return this.map.has(key) }
  iterator() { return this.map.entries() }
  keys() { return this.map.keys() }
  values() { return this.map.values() }
  clear() { this.map.clear() }
  open() { }
  close() { }
}
