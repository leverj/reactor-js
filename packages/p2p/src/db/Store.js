import {KeyvFile} from 'keyv-file'
import {Level} from 'level'
import {merge} from 'lodash-es'


// fixme: maybe not needed?
export class JsonStore extends KeyvFile {
  constructor(path, type, options) {
    super({filename: `${path}/${type}.json`}, options)
  }

  async update(key, value) {
    const updated = merge(await super.get(key) || {}, value)
    return this.set(key, updated)
  }
  async open() { }
  async close() { return super.disconnect() }
}

export class LevelStore {
  constructor(path, type, options = {}) {
    this.db = new Level(`${path}/${type}`, merge({valueEncoding: 'json'}, options))
  }
  async get(key, defaults) { return await this.db.get(key).catch(_ => defaults) }
  async getMany(keys) { return Promise.all(keys.map(async _ => this.get(_))) }
  async set(key, value) { return this.db.put(key, value) }
  async update(key, value) { return this.set(key, merge(await this.get(key, value), value)) }
  async delete(key) { return this.db.del(key) }
  async deleteMany(keys) { return Promise.all(keys.map(_ => this.delete(_))).then(_ => _.every(_ => _)) }
  async has(key) { return this.db.has(key) }
  // iterator() {}
  // keys() {}
  // values() {}
  async clear() { return this.db.clear() }
  async open() { return this.db.open() }
  async close() { return this.db.close() }
}

export const Store = {
  /**   Store api:
   *
    get<Value>(key: string)
    getMany<Value>(keys: string[])
    set(key: string, value: any)
    // update(key: string, value: any)
    delete(key: string)
    deleteMany(keys: string[])
    has(key: string)
    iterator()
    keys()
    values()
    clear()
    open()
    close()
   */
}
