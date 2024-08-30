import {Level} from 'level'
import {merge} from 'lodash-es'

export class LevelStore {
  constructor(path, type, options = {}) {
    this.db = new Level(`${path}/${type}`, merge({valueEncoding: 'json'}, options))
  }
  async get(key, defaults) { return await this.db.get(key).catch(_ => defaults) }
  // async getMany(keys) { return [] }
  async set(key, value) { return this.db.put(key, value) }
  async update(key, value) { return this.set(key, merge(await this.get(key, value), value)) }
  async delete(key) { return this.db.del(key) }
  // async deleteMany(keys) { }
  async has(key) { return this.db.has(key) }
  // iterator() {}
  // keys() {}
  // values() {}
  async clear() { return this.db.clear() }
  async open() { return this.db.open() }
  async close() { return this.db.close() }
}
