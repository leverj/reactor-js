import {Router} from 'express'

export function createRouter(config, leader) {
  const {bridge: {port, threshold}, externalIp} = config

  async function getMultiaddrs(req, res) {
    res.send({multiaddr: `/ip4/${externalIp}/tcp/${port}/p2p/${leader.peerId}`})
  }

  async function getAllMultiaddrs(req, res) {
    res.send(leader.multiaddrs)
  }

  async function getPeers(req, res) {
    res.send(leader.peers)
  }

  function getPeersStatus(req, res) {
    res.send(leader.monitor.getPeersStatus())
  }

  async function getBootstrappedPeers(req, res) {
    const results = []
    for (let each of leader.peers) results.push(await leader.network.findPeer(each))
    res.send(results)
  }

  async function establishGroupPublicKey(req, res) {
    await leader.leadership.establishGroupPublicKey(threshold).then(_ => res.send('ok'))
  }

  async function addVault(req, res) {
    const {chainId, address, providerURL} = req.body
    await leader.leadership.addVault(chainId, address, providerURL).then(_ => res.send('ok'))
  }

  async function getWhitelists(req, res) {
    res.send(leader.whitelist.get())
  }

  async function establishWhitelist(req, res) {
    await leader.leadership.establishWhitelist().then(_ => res.send('ok'))
  }

  const router = Router()
  router.get('/bridge/multiaddr', getMultiaddrs)
  router.get('/bridge/multiaddr/all', getAllMultiaddrs)
  router.get('/peer', getPeers)
  router.get('/peer/status', getPeersStatus)
  router.get('/peer/bootstrapped', getBootstrappedPeers)
  router.post('/dkg', establishGroupPublicKey)
  router.post('/vault', addVault)
  router.get('/whitelist', getWhitelists)
  router.post('/whitelist', establishWhitelist)
  return router
}
