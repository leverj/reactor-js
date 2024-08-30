import {KeyvFile} from 'keyv-file'
import {merge} from 'lodash-es'

export class KeyvStore extends KeyvFile {
  constructor(path, type, options = {writeDelay: 10}) {
    super(merge({filename: `${path}/${type}.json`}, options))
  }

  async update(key, value) {
    const updated = merge(await super.get(key) || {}, value)
    return super.set(key, updated)
  }
  async open() { }
  async close() { return super.disconnect() }
}
