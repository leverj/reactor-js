import {expect} from 'expect'
import {createBlockchainNodes, stopNodes} from './help/e2e.js'

describe('e2e', function () {

  afterEach(async () => await stopNodes())

  it('it should be able to connect with other nodes', async function () {
    let [leader, node1, node2, node3, node4, node5, node6] = await createBlockchainNodes(7)
    for (const node of [leader, node1, node2, node3, node4, node5, node6]) {
      expect(node.peers.length).toEqual(0)
    }
    for (const node of [node1, node2, node3, node4, node5, node6]) {
      leader.addNode(node.peerId, node.multiaddrs)

    }


  })

})
