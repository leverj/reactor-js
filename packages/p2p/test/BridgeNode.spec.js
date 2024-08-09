import {expect} from 'expect'
import {setTimeout} from 'node:timers/promises'
import {BridgeNode} from '../src/BridgeNode.js'
import {peerIdJsons} from './help/fixtures.js'

describe('BridgeNode', () => {
  const nodes = []

  afterEach(async () => {
    for (const node of nodes) await node.stop()
    nodes.length = 0
  })

  const createBridgeNodes = async (count) => {
    const bootstraps = []
    for (let i = 0; i < count; i++) {
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
  }

  it('should race connect multiple nodes with each other', async () => {
    //Starts breaking beyond 6 nodes. works fine till 6
    await createBridgeNodes(6)
    for (const node of nodes) {
      for (const peer of nodes) {
        if (node.multiaddrs[0] === peer.multiaddrs[0]) continue
        await node.connect(peer.peerId)
      }
    }
    //fixme: where are the asserts?
  })

  it('it should be able to connect with other nodes', async () => {
    const howMany = 7
    await createBridgeNodes(howMany)
    const leader = nodes[0]
    await leader.publishWhitelist() // whitelisted nodes
    for (const node of nodes) expect(node.whitelist.get().length).toEqual(howMany)

    await leader.startDKG(4)
    const leaderSecretKey = leader.tssNode.secretKeyShare.serializeToHexStr()
    const leaderGroupKey = leader.tssNode.groupPublicKey.serializeToHexStr()
    await setTimeout(10)
    for (const node of nodes) {
      node.tssNode.print()
      if (leader.peerId === node.peerId) continue
      expect(leaderGroupKey).toEqual(node.tssNode.groupPublicKey.serializeToHexStr())
      expect(leaderSecretKey).not.toBe(node.tssNode.secretKeyShare.serializeToHexStr())
    }
  })
})


