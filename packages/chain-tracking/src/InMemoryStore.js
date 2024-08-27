import {Map} from 'immutable'
import {merge} from 'lodash-es'

export class InMemoryStore {
  constructor() { this.map = Map().asMutable() }
  has(keys) { return this.map.hasIn(keys) }
  get(keys, defaults) { return this.map.getIn(keys, defaults)}
  set(keys, value) { this.map.setIn(keys, value) }
  update(keys, value) { this.set(keys, merge(this.get(keys, value), value)) }
  clear() { this.map.clear() }
  toObject() { return this.map.toObject() }
  toJSON() { return JSON.stringify(this.toObject(), null, 2) }
}
