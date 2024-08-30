import {Level} from 'level'
import {merge} from 'lodash-es'

export class LevelStore {
  static from(path, type) {
    const db = new Level(`${path}/${type}.json`, {valueEncoding: 'json'})
    return new this(db)
  }
  constructor(db) { this.db = db }
  async has(key) { return this.db.has(key) }
  async get(key, defaults) { return await this.db.get(key).catch(_ => defaults) }
  async set(key, value) { return this.db.put(key, value) }
  async update(key, value) { return this.set(key, merge(await this.get(key, value), value)) }
  async delete(key) { return this.db.del(key) }
  async clear() { return this.db.clear() }
  async open() { return this.db.open() }
  async close() { return this.db.close() }
}
