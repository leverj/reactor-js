import config from '@leverj/reactor.p2p/config'
import {expect} from 'expect'
import {setTimeout} from 'node:timers/promises'
import {createBridgeNodes} from './help/bridge.js'

const {bridge: {threshold}} = config

describe('BridgeNode', () => {
  let nodes

  afterEach(async () => { for (let each of nodes) await each.stop() })

  it('it can connect with other nodes', async () => {
    const howMany = threshold * 2 + 1
    nodes = await createBridgeNodes(howMany)
    const leader = nodes[0]
    await leader.leadership.publishWhitelist() // whitelisted nodes
    nodes.forEach(_ => expect(_.whitelist.get().length).toEqual(howMany))

    await leader.leadership.startDKG(howMany)
    await setTimeout(10)
    for (let each of nodes) {
      each.print()
      if (leader.peerId === each.peerId) continue
      expect(leader.groupPublicKey).toEqual(each.groupPublicKey)
      expect(leader.secretKeyShare).not.toBe(each.secretKeyShare)
    }
  })
})
