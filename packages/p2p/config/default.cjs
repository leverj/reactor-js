const path = require('path')
module.exports = {
  port: 9001,
  ip: '0.0.0.0',
  peer: {
    confDir: path.join(__dirname, '..', 'data'),
    port: 9002,
  }

}