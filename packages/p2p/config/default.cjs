const path = require('path')
module.exports = {
  port: 9001,
  ip: '0.0.0.0',
  bridge: {
    confDir: path.join(__dirname, '..', 'data'),
    port: 10001,
    isLeader: false
  },
  peer:{
    threshold: 4
  },
  bootstrap_nodes:[{
    url: 'http://127.0.0.1:9000'
  }]

}