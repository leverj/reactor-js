// Define custom environment variables for the p2p module
module.exports = {
  externalIp: 'EXTERNAL_IP',
  port: 'PORT',
  ip: 'IP',
  bridgeNode: {
    confDir: 'BRIDGE_CONF_DIR',
    port: 'BRIDGE_PORT',
    isLeader: 'BRIDGE_IS_LEADER',
    threshold: 'BRIDGE_THRESHOLD',
    bootstrapNode: 'BRIDGE_BOOTSTRAP_NODE'
  }
}