import {KeyvFile} from 'keyv-file'
import {merge} from 'lodash-es'

export class JsonStore extends KeyvFile {
  constructor(path, type, options = {writeDelay: 100}) {
    super({filename: `${path}/${type}.json`})
    // super(merge({filename: `${path}/${type}.json`}, options))
  }

  async update(key, value) {
    const updated = merge(await super.get(key) || {}, value)
    return this.set(key, updated)
  }
  async open() { }
  async close() { return super.disconnect() }
}
