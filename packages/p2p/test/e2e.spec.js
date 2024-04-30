import {expect} from 'expect'
import {createBridgeNodes, stopBridgeNodes} from './help/index.js'
import {setTimeout} from 'timers/promises'

describe('e2e', function () {

  afterEach(async () => await stopBridgeNodes())

  it('it should be able to connect with other nodes', async function () {
    let [leader, node1, node2, node3, node4, node5, node6] = await createBridgeNodes(7)
    let nodes = [leader, node1, node2, node3, node4, node5, node6]
    // whitelist nodes
    let peerIdsAndMultiAddrs = nodes.map(_ => ({peerId: _.peerId, multiaddr: _.multiaddrs[0]}))
    for (const node of nodes) {
      expect(node.peers.length).toEqual(0)
      node.whitelistPeers(...peerIdsAndMultiAddrs)
    }
    // start connecting
    for (const node of nodes) {
      node.connectWhitelisted().catch(console.error)
    }
    await setTimeout(1000)
    for (const node of [leader, node1, node2, node3, node4, node5, node6]) {
      expect(node.peers.length).toEqual(6)
    }

    await leader.startDKG(4)
    await setTimeout(2000)

    for (const node of nodes) {
      expect(leader.distributedKey.groupPublicKey.serializeToHexStr()).toEqual(node.distributedKey.groupPublicKey.serializeToHexStr())
      let leaderSecret = leader.distributedKey.secretKeyShare.serializeToHexStr()
      if(leader.peerId === node.peerId) continue
      let nodeSecret = node.distributedKey.secretKeyShare.serializeToHexStr()
      expect(leaderSecret).not.toBe(nodeSecret)
    }
  }).timeout(-1)

})
