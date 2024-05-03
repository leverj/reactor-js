import {Router} from 'express'
import config from 'config'
import {bridgeNode} from './bridgeInfo.js'

async function getMultiaddrs(req, res) {
  const multiaddr = `/ip4/${config.externalIp}/tcp/${config.bridgeNode.port}/p2p/${bridgeNode.peerId}`
  res.send({multiaddr})
}

async function getPeerInfo(req, res) {
  res.send(bridgeNode.exportJson())
}

async function startDkg(req, res) {
  await bridgeNode.startDKG(config.bridgeNode.threshold)
  res.send('ok')
}
async function joinBridgeRequest(req, res) {
  await bridgeNode.joinBridgeRequest(config.bridgeNode.bootstrapNode)
  res.send('ok')
}

/*
[
  {peerId: 'peerId', multiaddr: 'multiaddr'},
  {peerId: 'peerId', multiaddr: 'multiaddr'},
  {peerId: 'peerId', multiaddr: 'multiaddr'},
  {peerId: 'peerId', multiaddr: 'multiaddr'},
  {peerId: 'peerId', multiaddr: 'multiaddr'},
  {peerId: 'peerId', multiaddr: 'multiaddr'},
]
 */
async function addPeer(req, res) {
  const peers = req.body
  await bridgeNode.addPeersToWhiteList(...peers)
  res.send('ok')
}

export const router = Router()
router.get('/fixme/bridge/multiaddr', getMultiaddrs)
router.get('/peer/info', getPeerInfo)
router.post('/peer/add',  addPeer)
router.post('/peer/joinBridgeRequest', joinBridgeRequest)
router.post('/dkg/start',  startDkg)
export default router
