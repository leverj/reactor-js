const path = require('path')
module.exports = {
  externalIp: '127.0.0.1',
  port: 9001,
  ip: '0.0.0.0',
  bridgeNode: {
    confDir: path.join(__dirname, '..', 'data'),
    port: 10001,
    isLeader: false,
    threshold: 4,
    bootstrapNode:'http://127.0.0.1:9001'
  }
}