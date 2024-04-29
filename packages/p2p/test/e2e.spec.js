import {expect} from 'expect'
import {createBlockchainNodes, stopNodes} from './help/e2e.js'
import {setTimeout} from 'timers/promises'

describe('e2e', function () {

  afterEach(async () => await stopNodes())

  it('it should be able to connect with other nodes', async function () {
    let [leader, node1, node2, node3, node4, node5, node6] = await createBlockchainNodes(7)
    let nodes = [leader, node1, node2, node3, node4, node5, node6]
    for (const node of nodes) {
      expect(node.peers.length).toEqual(0)
      node.addToKnownPeers(...nodes.map(_ => _.peerId))
    }
    for (const node of nodes) {
      for (const peer of nodes) {
        if (peer.peerId !== node.peerId) {
          await setTimeout(100)
          await node.connect(peer.multiaddrs[0])
        }
      }
    }
    await setTimeout(100)
    for (const node of [leader, node1, node2, node3, node4, node5, node6]) {
      expect(node.peers.length).toEqual(6)
    }

    await leader.startDKG()


  }).timeout(-1)

})
