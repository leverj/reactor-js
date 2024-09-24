import info from '../package.json' assert {type: 'json'}

const dataDir = `${import.meta.dirname}/../../../data`

export const defaults = {
  bridge: {
    nodesDir: `${dataDir}/${info.name}/nodes`,
  }
}
