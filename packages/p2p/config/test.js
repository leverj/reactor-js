const dataDir = `${import.meta.dirname}/../../../data`

export default {
  bridge: {
    confDir: `${dataDir}/p2p/test`,
  },
  chain: {
    polling: {
      interval: 10,
      attempts: 5,
    },
  }
}
