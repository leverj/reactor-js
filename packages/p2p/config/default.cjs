const path = require('path')

module.exports = {
  externalIp: '127.0.0.1',
  port: 9000,
  ip: '0.0.0.0',
  timeout: 100,
  tryCount: 50,
  bridgeNode: {
    confDir: path.join(__dirname, '..', 'data'),
    port: 10000,
    threshold: 4,
    bootstrapNodes: [],
  },
  chain: {
    polling: {
      interval: 15 /* seconds */ * 1000,
      attempts: 5,
    },
  }
}
