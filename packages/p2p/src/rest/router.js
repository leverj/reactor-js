import {Router} from 'express'
import config from 'config'
import {bridgeNode} from './manager.js'
import {peerIdFromString} from '@libp2p/peer-id'

async function getAllMultiaddrs(req, res) { res.send(bridgeNode.multiaddrs)}

async function getInfo(req, res) { res.send(bridgeNode.exportJson())}

async function getPeers(req, res) { res.send(bridgeNode.peers)}

async function startDkg(req, res) {
  await bridgeNode.startDKG(config.bridgeNode.threshold)
  res.send('ok')
}

async function aggregateSignature(req, res) {
  if (!bridgeNode.isLeader) return
  const msg = req.body
  await bridgeNode.aggregateSignature(msg.txnHash, msg.msg)
  res.send('ok')
}

async function getAggregateSignature(req, res) {
  res.send(bridgeNode.getAggregateSignature(req.query.txnHash))
}

async function getPublicKey(req, res) {
  res.send({publicKey: bridgeNode.tssNode.groupPublicKey.serializeToHexStr()})
}

async function getWhiteLists(req, res) {
  res.send(Object.keys(bridgeNode.whitelisted))
}

async function publishWhitelist(req, res) {
  if (!bridgeNode.isLeader) return
  await bridgeNode.publishWhitelist()
  res.send('ok')
}

async function getBootstrapPeers(req, res) {
  const peers = bridgeNode.peers
  const all = []
  for (const peer of peers) {
    const info = await bridgeNode.p2p.peerRouting.findPeer(peerIdFromString(peer))
    all.push(info)
  }
  console.log('#'.repeat(50), 'peerinfo', all)
  res.send(all)
}

export const router = Router()
router.get('/fixme/bridge/multiaddr/all', getAllMultiaddrs)
router.get('/info', getInfo)
router.get('/peer', getPeers)
router.get('/peer/bootstrapped', getBootstrapPeers)
router.post('/tss/aggregateSign', aggregateSignature)
router.get('/tss/aggregateSign', getAggregateSignature)
router.post('/dkg/start', startDkg)
router.get('/dkg/publicKey', getPublicKey)
router.get('/peer/whitelist', getWhiteLists)
router.post('/publish/whitelist', publishWhitelist)
export default router
