import {expect} from 'expect'
import {setTimeout} from 'node:timers/promises'
import {BridgeNode} from '../src/BridgeNode.js'
import {peerIdJsons} from './help/fixtures.js'

describe('BridgeNode', () => {
  const nodes = []

  afterEach(async () => {
    for (let each of nodes) await each.stop()
    nodes.length = 0
  })

  const createBridgeNodes = async (count) => {
    const bootstraps = []
    for (let i = 0; i < count; i++) {
      const node = await BridgeNode.from({
        port: 9000 + i,
        isLeader: i === 0,
        json: {p2p: peerIdJsons[i]},
        bootstrapNodes: bootstraps,
      })
      await node.start()
      nodes.push(node)
      if (i === 0) bootstraps.push(node.multiaddrs[0])
    }
  }

  it('should race connect multiple nodes with each other', async () => {
    //Starts breaking beyond 6 nodes. works fine till 6
    await createBridgeNodes(6)
    for (let node of nodes) {
      for (let peer of nodes) {
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
    nodes.forEach(_ => expect(_.whitelist.get().length).toEqual(howMany))

    await leader.startDKG(4)
    const leaderSecretKey = leader.tss.secretKeyShare.serializeToHexStr()
    const leaderGroupKey = leader.tss.groupPublicKey.serializeToHexStr()
    await setTimeout(10)
    for (let each of nodes) {
      each.tss.print()
      if (leader.peerId === each.peerId) continue
      expect(leaderGroupKey).toEqual(each.tss.groupPublicKey.serializeToHexStr())
      expect(leaderSecretKey).not.toBe(each.tss.secretKeyShare.serializeToHexStr())
    }
  })
})


