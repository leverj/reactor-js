import {InMemoryStore} from './InMemoryStore.js'
import {JsonDirStore} from './JsonDirStore.js'
import {LevelStore} from './LevelStore.js'

export const Store = {
  InMemory: (path, type, options) => new InMemoryStore(path, type, options),
  Json: async (path, type) => new JsonDirStore(path, type),
  Level: async (path, type, options) => LevelStore.from(path, type, options),
}
