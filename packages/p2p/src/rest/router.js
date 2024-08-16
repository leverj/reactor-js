import {peerIdFromString} from '@libp2p/peer-id'
import config from 'config'
import {Router} from 'express'
import node from './manager.js'

const multiaddr = `/ip4/${config.externalIp}/tcp/${config.bridgeNode.port}/p2p/${node.peerId}`

async function getMultiaddrs(req, res) {
  res.send({multiaddr})
}

async function getAllMultiaddrs(req, res) {
  res.send(node.multiaddrs)
}

async function getPeers(req, res) {
  res.send(node.peers)
}

function getPeersStatus(req, res) {
  res.send(node.monitor.getPeersStatus())
}

async function startDkg(req, res) {
  await node.startDKG(config.bridgeNode.threshold)
  res.send('ok')
}

async function aggregateSignature(req, res) {
  const msg = req.body
  await node.aggregateSignature(msg.txnHash, msg.msg, -1, () => {
  })
  res.send('ok')
}

async function getAggregateSignature(req, res) {
  res.send(node.getAggregateSignature(req.query.txnHash))
}

async function getWhitelists(req, res) {
  res.send(node.whitelist.get())
}

async function publishWhitelist(req, res) {
  await node.publishWhitelist()
  res.send('ok')
}

async function getBootstrapPeers(req, res) {
  const peers = node.peers
  const all = []
  for (let each of peers) all.push(await node.network.p2p.peerRouting.findPeer(peerIdFromString(each)))
  res.send(all)
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
