import {Router} from 'express'
import config from 'config'
import {bridge} from './bridgeInfo.js'

async function getPeerInfo(req, res) {
  res.send(bridge.exportJson())
}

async function startDkg(req, res) {
  await bridge.startDKG(config.peer.threshold)
  res.send('ok')
}
async function sendFriendRequest(req, res) {
  await bridge.sendFriendRequest(config.bootstrap_nodes)
  res.send('ok')
}
async function addPeer(req, res) {
  const {peerId, multiaddr} = req.body
  await bridge.addPeersToWhiteList({peerId, multiaddr})
  res.send('ok')
}

export const router = Router()
router.get('/peer/info', getPeerInfo)
router.post('/peer/add',  addPeer)
router.post('/peer/sendFriendRequest',  sendFriendRequest)
router.post('/dkg/start',  startDkg)
export default router
