import config from '@leverj/reactor.p2p/config'
import {expect} from 'expect'
import {setTimeout} from 'node:timers/promises'
import {createBridgeNodes} from './help/bridge.js'

const {bridge: {threshold}} = config

describe('BridgeNode', () => {
  const howMany = threshold + 1
  let nodes, leader

  beforeEach(async () => {
    nodes = await createBridgeNodes(howMany)
    leader = nodes[0]
  })
  afterEach(async () => {
    for (let each of nodes) await each.stop()
  })

  it('can whitelisted nodes', async () => {
    nodes.forEach(_ => expect(_.whitelist.get().length).toEqual(_.isLeader ? howMany : 1))

    await leader.publishWhitelist()
    nodes.forEach(_ => expect(_.whitelist.get().length).toEqual(howMany))
  })

  it('can generate DKG', async () => {
    await leader.publishWhitelist()
    expect(leader?.groupPublicKey).toBeUndefined()

    await leader.startDKG(howMany)
    await setTimeout(100)
    expect(leader.groupPublicKey).toBeDefined()
    nodes.filter(_ => !_.isLeader).forEach(_ => {
      expect(leader.groupPublicKey).toEqual(_.groupPublicKey)
      expect(leader.secretKeyShare).not.toBe(_.secretKeyShare)
    })
  })
})
