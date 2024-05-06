import {Router} from 'express'
import config from 'config'
import {bridgeNode} from './bridgeInfo.js'
import axios from 'axios'
import {setTimeout} from 'timers/promises'


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
  const addPeerUrl = config.bridgeNode.bootstrapNode + '/api/peer/add'
  const peerInfoUrl = 'http://' + config.externalIp + ':' + config.port + '/api/peer/info'
  const multiaddr = `/ip4/${config.externalIp}/tcp/${config.bridgeNode.port}/p2p/${bridgeNode.peerId}`
  await axios.post(addPeerUrl, [{peerId: bridgeNode.peerId, multiaddr, ip: config.externalIp, port: config.port}])
  /*console.log('bootstrap url', config.bridgeNode.bootstrapNode + '/api/peer/info')
  const httpResp = await axios.get(config.bridgeNode.bootstrapNode + '/api/peer/info')
  console.log('bootstrapNodeInfo', httpResp.body)*/
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
  //console.log('addPeer called on ', config.bridgeNode.isLeader, config.port)
  const peers = req.body
  await bridgeNode.addPeersToWhiteList(...peers)
  //Leader needs to broadcast updated whitelist to all the nodes
  if (bridgeNode.isLeader) {
    const whiteListInBootstrap = bridgeNode.whitelisted
    const whiteListInput = []
    for (const [peerId, {multiaddr, ip, port}] of Object.entries(whiteListInBootstrap)) {
      whiteListInput.push({peerId, multiaddr, ip, port})
    }
    for (const peer of whiteListInput) {
      if (peer.peerId === bridgeNode.peerId) continue
      const addPeerUrl = 'http://' + peer.ip + ':' + peer.port + '/api/peer/add'
      await axios.post(addPeerUrl, whiteListInput)
      await setTimeout(1000)
    }
  }
  res.send('ok')
}

export const router = Router()
router.get('/fixme/bridge/multiaddr', getMultiaddrs)
router.get('/peer/info', getPeerInfo)
router.post('/peer/add', addPeer)
router.post('/peer/joinBridgeRequest', joinBridgeRequest)
router.post('/dkg/start', startDkg)
export default router
