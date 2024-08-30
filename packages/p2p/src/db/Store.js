import {InMemoryStore} from './InMemoryStore.js'
import {JsonDirStore} from './JsonDirStore.js'
import {KeyvStore} from './KeyvStore.js'
import {LevelStore} from './LevelStore.js'

export const Store = {
  InMemory: (path, type, options) => new InMemoryStore(path, type, options),
  Json: (path, type) => new JsonDirStore(path, type),
  Keyv: (path, type, options) => new KeyvStore(path, type, options),
  Level: (path, type, options) => new LevelStore(path, type, options),
}
