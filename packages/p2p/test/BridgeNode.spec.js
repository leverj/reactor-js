import {expect} from 'expect'
import {setTimeout} from 'node:timers/promises'
import {createBridgeNodes} from './help.js'

describe('BridgeNode', () => {
  let nodes

  afterEach(async () => { for (let each of nodes) await each.stop() })

  it('it should be able to connect with other nodes', async () => {
    const howMany = 7
    nodes = await createBridgeNodes(howMany)
    const leader = nodes[0]
    await leader.publishWhitelist() // whitelisted nodes
    nodes.forEach(_ => expect(_.whitelist.get().length).toEqual(howMany))

    await leader.startDKG(4)
    const leaderSecretKey = leader.secretKeyShare
    const leaderGroupKey = leader.groupPublicKey
    await setTimeout(10)
    for (let each of nodes) {
      each.print()
      if (leader.peerId === each.peerId) continue
      expect(leaderGroupKey).toEqual(each.groupPublicKey)
      expect(leaderSecretKey).not.toBe(each.secretKeyShare)
    }
  })
})
