import {Map} from 'immutable'
import {merge} from 'lodash-es'

export class InMemoryStore {
  constructor() { this.map = Map().asMutable() }
  has(key) { return this.map.has(key) }
  get(key, defaults) { return this.map.get(key, defaults)}
  set(key, value) { this.map.set(key, value) }
  update(key, value) { this.set(key, merge(this.get(key, value), value)) }
  create() { }
  destroy() { this.clear() }
  clear() { this.map.clear() }
}
