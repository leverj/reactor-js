import {Router} from 'express'
import config from 'config'
import {bridgeNode} from './manager.js'

const multiaddr = `/ip4/${config.externalIp}/tcp/${config.bridgeNode.port}/p2p/${bridgeNode.peerId}`
async function getMultiaddrs(req, res) {
  res.send({multiaddr})}

async function getInfo(req, res) { res.send(bridgeNode.exportJson())}

async function getPeers(req, res) { res.send(bridgeNode.peers)}

async function connect(req, res) {
  await bridgeNode.connectToWhiteListedPeers().catch(console.error)
  res.send('ok')
}

async function startDkg(req, res) {
  await bridgeNode.startDKG(config.bridgeNode.threshold)
  res.send('ok')
}

async function addPeer(req, res) {
  if (!bridgeNode.isLeader) return
  const peers = req.body
  bridgeNode.addPeersToWhiteList(...peers)
  let leaderInfo = {peerId: bridgeNode.peerId, multiaddr, ip: config.externalIp, port: config.port}
  res.send(leaderInfo)
}

async function signMessage(req, res) {
  const msg = req.body
  const signature = await bridgeNode.tssNode.sign(msg.msg)
  const signerPubKey = await bridgeNode.tssNode.publicKey
  res.send({'signature': signature.serializeToHexStr(), 'signer': bridgeNode.tssNode.id.serializeToHexStr(), 'signerPubKey': signerPubKey.serializeToHexStr()})
}

async function aggregateSignature(req, res) {
  if (!bridgeNode.isLeader) return
  const msg = req.body
  await bridgeNode.aggregateSignature(msg.txnHash, msg.msg)
  res.send('ok')
}

async function aggregateSignatureStatus(req, res) {
  res.send(bridgeNode.aggregateSignatureStatus(req.query.txnHash))
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

async function getLeader(req, res) {
  res.send({leader: bridgeNode.leader})
}

export const router = Router()
router.get('/fixme/bridge/multiaddr', getMultiaddrs)
router.get('/info', getInfo)
router.get('/peer', getPeers)
router.get('/peer/leader', getLeader)
router.post('/temp/toadmin/add', addPeer) //fixme: this is temporary for fast testing
router.post('/tss/sign', signMessage)
router.post('/tss/aggregateSign', aggregateSignature)
router.get('/tss/aggregateSignStatus', aggregateSignatureStatus)
router.post('/peer/connect', connect)
router.post('/dkg/start', startDkg)
router.get('/dkg/publicKey', getPublicKey)
router.get('/peer/whitelist', getWhiteLists)
router.post('/publish/whitelist', publishWhitelist)
export default router
