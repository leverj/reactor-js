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

  async function startDkg(req, res) {
    await leader.leadership.startDKG(threshold).then(_ => res.send('ok'))
  }

  async function getWhitelists(req, res) {
    res.send(leader.whitelist.get())
  }

  async function publishWhitelist(req, res) {
    await leader.leadership.publishWhitelist().then(_ => res.send('ok'))
  }

  async function getBootstrapPeers(req, res) {
    const results = []
    for (let each of leader.peers) results.push(await leader.network.findPeer(each))
    res.send(results)
  }

  const router = Router()
  router.get('/fixme/bridge/multiaddr', getMultiaddrs)
  router.get('/fixme/bridge/multiaddr/all', getAllMultiaddrs)
  router.get('/peer', getPeers)
  router.get('/peer/status', getPeersStatus)
  router.get('/peer/bootstrapped', getBootstrapPeers)
  router.post('/dkg/start', startDkg)
  router.get('/whitelist', getWhitelists)
  router.post('/whitelist/publish', publishWhitelist)
  return router
}
