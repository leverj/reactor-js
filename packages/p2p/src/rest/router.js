import {Router} from 'express'
import config from 'config'
import {bridge} from './NetworkInfo.js'

async function getPeerInfo(req, res) {
  const peerInfo = {
    peerId: bridge.peerId,
    multiaddr: bridge.multiaddr,
    peers: bridge.peers,
    threshold: config.peer.threshold,
    isLeader: bridge.isLeader,
  }
  res.send(peerInfo)
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
router.get('/peer/info', getPeerInfo)
router.post('/peer/add',  addPeer)
router.post('/dkg/start',  startDkg)
export default router
