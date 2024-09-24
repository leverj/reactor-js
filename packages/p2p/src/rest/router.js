import {Router} from 'express'

export function createRouter(config, node) {
  const {bridge: {port, threshold}, externalIp} = config

  async function getMultiaddrs(req, res) {
    res.send({multiaddr: `/ip4/${externalIp}/tcp/${port}/p2p/${node.peerId}`})
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
    await node.leadership.startDKG(threshold).then(_ => res.send('ok'))
  }

  async function aggregateSignature(req, res) {
    res.send('ok') //fixme: not ready for e2e. not clear what it should actually accomplish when ready ...
    if (false) await node.leadership.aggregateSignature(-1, req.body.message).then(_ => res.send('ok'))
  }

  async function getAggregateSignature(req, res) {
    res.send(node.leadership.aggregateSignatures[req.query.transferHash])
  }

  async function getWhitelists(req, res) {
    res.send(node.whitelist.get())
  }

  async function publishWhitelist(req, res) {
    await node.leadership.publishWhitelist().then(_ => res.send('ok'))
  }

  async function getBootstrapPeers(req, res) {
    const results = []
    for (let each of node.peers) results.push(await node.network.findPeer(each))
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
  return router
}
