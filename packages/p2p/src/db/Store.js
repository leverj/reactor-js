import {InMemoryStore} from './InMemoryStore.js'
import {JsonDirStore} from './JsonDirStore.js'
import {KeyvStore} from './KeyvStore.js'
import {LevelStore} from './LevelStore.js'

export const Store = {
  InMemory: () => new InMemoryStore(),
  JsonDir: (path, type) => new JsonDirStore(path, type),
  Json: (path, type, options) => new KeyvStore(path, type, options),
  Level: (path, type, options) => new LevelStore(path, type, options),

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
    iterator()
    keys()
    values()
    clear()
    open()
    close()
   */
}
