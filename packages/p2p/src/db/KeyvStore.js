import {KeyvFile} from 'keyv-file'
import {merge} from 'lodash-es'

export class KeyvStore extends KeyvFile {
  constructor(path, type, options = {writeDelay: 100}) {
    super(Object.assign({filename: `${path}/${type}.json`}, options))
  }

  async update(key, value) {
    const update = merge(await super.get(key) || {}, value)
    return super.set(key, update) }
}
