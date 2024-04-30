import {expect} from 'expect'
import {createBridgeNodes, stopNodes} from './help/e2e.js'
import {setTimeout} from 'timers/promises'

describe('e2e', function () {

  afterEach(async () => await stopNodes())

  it('it should be able to connect with other nodes', async function () {
    let [leader, node1, node2, node3, node4, node5, node6] = await createBridgeNodes(7)
    let nodes = [leader, node1, node2, node3, node4, node5, node6]
    // whitelist nodes
    for (const node of nodes) {
      expect(node.peers.length).toEqual(0)
      node.whitelistPeers(...nodes.map(_ => ({peerId: _.peerId, multiaddr: _.multiaddrs[0]})))
    }
    // start connecting
    for (const node of nodes) {
      await node.connectWhitelisted()
    }
    await setTimeout(100)
    for (const node of [leader, node1, node2, node3, node4, node5, node6]) {
      expect(node.peers.length).toEqual(6)
    }

    await leader.startDKG(4)
    await setTimeout(2000)

  }).timeout(-1)

})
