// Define custom environment variables for the p2p module
module.exports = {
  externalIp: 'EXTERNAL_IP',
  port: 'PORT',
  ip: 'IP',
  bridgeNode: {
    confDir: 'BRIDGE_CONF_DIR',
    port: 'BRIDGE_PORT',
    isLeader: {__name: 'BRIDGE_IS_LEADER', __format: 'boolean'},
    threshold: {__name: 'BRIDGE_THRESHOLD', __format: 'number'},
    bootstrapNode: 'BRIDGE_BOOTSTRAP_NODE'
  }
}