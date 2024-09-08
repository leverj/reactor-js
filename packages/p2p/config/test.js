const dataDir = `${import.meta.dirname}/../../../data`

export default {
  bridgeNode: {
    confDir: `${dataDir}/p2p/test`,
  },
  chain: {
    polling: {
      interval: 10,
    },
  }
}
