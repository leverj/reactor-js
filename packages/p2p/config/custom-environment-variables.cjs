// Define custom environment variables for the p2p module
module.exports = {
  port: 'PORT',
  ip: 'IP',
  bridge: {
    confDir: 'PEER_CONF_DIR',
    port: 'PEER_PORT',
    isLeader: 'PEER_IS_LEADER'
  }
}