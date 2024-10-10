export const dataDir = `${import.meta.dirname}/../../../data`

export const defaults = {
  bridge: {
    nodesDir: function () { return `${dataDir}/p2p/${this.env}` },
  }
}
