import {JsonStore} from './JsonStore.js'
import {KeyvStore} from './KeyvStore.js'

export const Store = {
  Json: (path, type) => new JsonStore(path, type),
  Keyv: (path, type, options) => new KeyvStore(path, type, options),
}
