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
    isLeader: false,
    threshold: 4,
    isPublic: true,
    bootstrapNodes: [],
    contractAddress: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    providerUrl: 'http://127.0.0.1:8545'
  }
}