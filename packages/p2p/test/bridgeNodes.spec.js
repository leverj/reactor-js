import {expect} from 'expect'
import {setTimeout} from 'timers/promises'
import BridgeNode from '../src/BridgeNode.js'
import {peerIdJsons} from './help/index.js'

describe('Bridge node', function () {
  const nodes = []

  const stopBridgeNodes = async () => {
    for (const node of nodes) await node.stop()
    nodes.length = 0
  }

  const createBridgeNodes = async (count) => {
    const bootstraps = []
    for (let i = 0; i < count; i++) {
      // fixme: get peerid from config eventually some file
      const node = new BridgeNode({
        port: 9000 + i,
        isLeader: i === 0,
        json: {p2p: peerIdJsons[i]},
        bootstrapNodes: bootstraps,
      })
      await node.create()
      nodes.push(node)
      if (i === 0) bootstraps.push(node.multiaddrs[0])
    }
    return nodes
  }

  afterEach(async () => await stopBridgeNodes())

  it('should race connect multiple nodes with each other', async function () {
    //Starts breaking beyond 6 nodes. works fine till 6
    const nodes = await createBridgeNodes(6)
    for (const node of nodes) {
      for (const peer of nodes) {
        if (node.multiaddrs[0] === peer.multiaddrs[0]) continue
        await node.connect(peer.peerId)
      }
    }
  })

  it('it should be able to connect with other nodes', async function () {
    const [leader, node1, node2, node3, node4, node5, node6] = await createBridgeNodes(7)
    const nodes = [leader, node1, node2, node3, node4, node5, node6]
    // whitelisted nodes
    await leader.publishWhitelist()
    await setTimeout(100)
    for (const node of nodes) expect(node.whitelist.get().length).toEqual(7)
    await leader.startDKG(4)
    await setTimeout(2000)
    for (const node of nodes) {
      node.tssNode.print()
      expect(leader.tssNode.groupPublicKey.serializeToHexStr()).toEqual(node.tssNode.groupPublicKey.serializeToHexStr())
      const leaderSecret = leader.tssNode.secretKeyShare.serializeToHexStr()
      if (leader.peerId === node.peerId) continue
      const nodeSecret = node.tssNode.secretKeyShare.serializeToHexStr()
      expect(leaderSecret).not.toBe(nodeSecret)
    }
  })
})


