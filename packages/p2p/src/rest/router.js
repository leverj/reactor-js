import {Router} from 'express'
import BridgeNode from '../BridgeNode.js'
import config from 'config'

const peerIdJson = JSON.stringify(fs.readFileSync(path.join(config.nodeDirectory, 'peer.json'), 'utf8'))

const bridge = new BridgeNode({port: config.peer.port, isLeader: config.peer.isLeader, peerIdJson})

if(!peerIdJson){
  await saveToDisk(path.join(config.nodeDirectory, 'peer.json'), JSON.stringify(bridge.exportPeerId()))
}

async function startDkg(req, res) {
  await bridge.startDKG(config.peer.threshold)
  res.send('ok')
}

async function addPeer(req, res) {
  const {peerId, multiaddr} = req.body
  await bridge.addPeer({peerId, multiaddr})
  res.send('ok')
}

export const router = Router()
router.post('/peer/add',  addPeer)
router.post('/dkg/start',  startDkg)
export default router
