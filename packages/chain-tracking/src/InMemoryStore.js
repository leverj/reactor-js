import {Map} from 'immutable'
import {merge} from 'lodash-es'

export class InMemoryStore {
  constructor() { this.map = Map().asMutable() }
  async has(key) { return this.map.has(key) }
  async get(key, defaults) { return this.map.get(key, defaults)}
  async set(key, value) { return this.map.set(key, value) }
  async update(key, value) { return this.set(key, merge(await this.get(key, value), value)) }
  async create() { } //fixme: eliminate
  async destroy() { return this.clear() }
  async clear() { return this.map.clear() }
}
