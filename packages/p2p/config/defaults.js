import info from '../package.json' assert {type: 'json'}
import {last} from 'lodash-es'

const dataDir = `${import.meta.dirname}/../../../data`
export const packageName = last(info.name.split('/'))

export const defaults = {
  bridge: {
    nodesDir: function () { return `${dataDir}/${packageName}/${this.env}` },
  }
}
