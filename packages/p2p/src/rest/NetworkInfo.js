import fs from 'fs'
import path from 'path'
import config from 'config'
import BridgeNode from '../BridgeNode.js'

function getPeerIdJson() {
  const file = path.join(config.peer.confDir, 'peer.json')
  if (fs.existsSync(file)) {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  }
}
function savePeerIdJson(peerIdJson) {
  const file = path.join(config.peer.confDir, 'peer.json')
  fs.writeFileSync(file, JSON.stringify(peerIdJson), 'utf8')
}

const peerIdJson = getPeerIdJson()
export const bridge = new BridgeNode({port: config.peer.port, isLeader: config.peer.isLeader, peerIdJson})
await bridge.create()
if(!peerIdJson)  savePeerIdJson(bridge.exportPeerId())


