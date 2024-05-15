import {Router} from 'express'
import config from 'config'
import {bridgeNode} from './manager.js'
import axios from 'axios'
import {tryAgainIfConnectionError} from '../utils.js'


async function getMultiaddrs(req, res) { res.send({multiaddr: `/ip4/${config.externalIp}/tcp/${config.bridgeNode.port}/p2p/${bridgeNode.peerId}`})}

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

async function joinBridgeRequest(req, res) {
  const addPeerUrl = config.bridgeNode.bootstrapNode + '/api/peer/add'
  const multiaddr = `/ip4/${config.externalIp}/tcp/${config.bridgeNode.port}/p2p/${bridgeNode.peerId}`
  await axios.post(addPeerUrl, [{peerId: bridgeNode.peerId, multiaddr, ip: config.externalIp, port: config.port}])
  res.send('ok')
}

async function addPeer(req, res) {
  const peers = req.body
  bridgeNode.addPeersToWhiteList(...peers)
  //Leader needs to broadcast updated whitelist to all the nodes
  if (bridgeNode.isLeader) {
    const whiteListInput = []
    for (const [peerId, {multiaddr, ip, port}] of Object.entries(bridgeNode.whitelisted)) {
      whiteListInput.push({peerId, multiaddr, ip, port})
    }
    for (const peer of whiteListInput) {
      if (peer.peerId === bridgeNode.peerId) continue
      const addPeerUrl = 'http://' + peer.ip + ':' + peer.port + '/api/peer/add'
      await tryAgainIfConnectionError(_ => axios.post(addPeerUrl, whiteListInput))
    }
  }
  res.send('ok')
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

export const router = Router()
router.get('/fixme/bridge/multiaddr', getMultiaddrs)
router.get('/info', getInfo)
router.get('/peer', getPeers)
router.post('/peer/add', addPeer)
router.post('/tss/sign', signMessage)
router.post('/tss/aggregateSign', aggregateSignature)
router.get('/tss/aggregateSignStatus', aggregateSignatureStatus)
router.post('/peer/connect', connect)
router.post('/peer/joinBridgeRequest', joinBridgeRequest)
router.post('/dkg/start', startDkg)
router.get('/dkg/publicKey', getPublicKey)
router.get('/peer/whitelist', getWhiteLists)
export default router
