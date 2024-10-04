import {BridgeNode} from '@leverj/reactor.p2p'
import config from '@leverj/reactor.p2p/config'
import {expect} from 'expect'
import {setTimeout} from 'node:timers/promises'
import {peerIdJsons} from '../fixtures.js'

async function createBridgeNodes(howMany) {
  const nodes = []
  const bootstrapNodes = []
  for (let i = 0; i < howMany; i++) {
    const data = {p2p: peerIdJsons[i]}
    const node = await BridgeNode.from(config, config.bridge.port + i, bootstrapNodes, data)
    if (i === 0) bootstrapNodes.push(node.multiaddrs[0])
    nodes.push(node)
  }
  return nodes
}

describe('BridgeNode', () => {
  const howMany = config.bridge.threshold + 1
  let nodes, leader

  beforeEach(async () => {
    nodes = await createBridgeNodes(howMany)
    leader = nodes[0].leadership
    for (let each of nodes) await each.start()
  })
  afterEach(async () => { for (let each of nodes) await each.stop() })

  it('can whitelisted nodes', async () => {
    nodes.forEach(_ => expect(_.whitelist.get().length).toEqual(_.isLeader ? howMany : 1))

    await leader.establishWhitelist()
    await setTimeout(10)
    nodes.forEach(_ => expect(_.whitelist.get().length).toEqual(howMany))
  })

  it('can complete DKG', async () => {
    await leader.establishWhitelist()
    expect(leader?.publicKey).toBeUndefined()

    await leader.establishGroupPublicKey(howMany)
    await setTimeout(100)
    expect(leader.publicKey).toBeDefined()
    nodes.filter(_ => !_.isLeader).forEach(_ => {
      expect(leader.self.groupPublicKey).toEqual(_.groupPublicKey)
      expect(leader.self.secretKeyShare).not.toBe(_.secretKeyShare)
    })
  })
})
