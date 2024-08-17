import {peerIdFromString} from '@libp2p/peer-id'
import config from 'config'
import {Router} from 'express'
import manager from './manager.js'

const {bridgeNode, externalIp} = config
const multiaddr = `/ip4/${externalIp}/tcp/${bridgeNode.port}/p2p/${manager.peerId}`

async function getMultiaddrs(req, res) {
  res.send({multiaddr})
}

async function getAllMultiaddrs(req, res) {
  res.send(manager.multiaddrs)
}

async function getPeers(req, res) {
  res.send(manager.peers)
}

function getPeersStatus(req, res) {
  res.send(manager.monitor.getPeersStatus())
}

async function startDkg(req, res) {
  await manager.startDKG(bridgeNode.threshold).then(_ => res.send('ok'))
}

async function aggregateSignature(req, res) {
  const {txnHash, msg} = req.body
  await manager.aggregateSignature(txnHash, msg, -1, () => {}).then(_ => res.send('ok'))
}

async function getAggregateSignature(req, res) {
  res.send(manager.getAggregateSignature(req.query.txnHash))
}

async function getWhitelists(req, res) {
  res.send(manager.whitelist.get())
}

async function publishWhitelist(req, res) {
  await manager.publishWhitelist().then(_ => res.send('ok'))
}

async function getBootstrapPeers(req, res) {
  const results = []
  for (let each of manager.peers) results.push(await manager.network.p2p.peerRouting.findPeer(peerIdFromString(each)))
  res.send(results)
}

const router = Router()
router.get('/fixme/bridge/multiaddr', getMultiaddrs)
router.get('/fixme/bridge/multiaddr/all', getAllMultiaddrs)
router.get('/peer', getPeers)
router.get('/peer/status', getPeersStatus)
router.get('/peer/bootstrapped', getBootstrapPeers)
router.post('/tss/aggregateSign', aggregateSignature)
router.get('/tss/aggregateSign', getAggregateSignature)
router.post('/dkg/start', startDkg)
router.get('/whitelist', getWhitelists)
router.post('/whitelist/publish', publishWhitelist)

export default router
