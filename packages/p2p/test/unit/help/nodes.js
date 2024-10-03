import {InMemoryStore} from '@leverj/common'
import {BridgeNode} from '@leverj/reactor.p2p'
import {setTimeout} from 'node:timers/promises'
import {peerIdJsons} from '../../fixtures.js'

export class Nodes {
  constructor(config) {
    this.config = config
    this.nodes = []
  }
  get leader() { return this.nodes[0].leadership }

  async start() {
    const {port: leaderPort, bridge: {threshold}} = this.config
    const bootstrapNodes = []
    for (let i = 0; i < threshold + 1; i++) {
      const data = {p2p: peerIdJsons[i]}
      const node = await BridgeNode.from(this.config, leaderPort + i, bootstrapNodes, data)
      await node.start()
      if (i === 0) bootstrapNodes.push(node.multiaddrs[0])
      this.nodes.push(node)
    }
    this.leader.setupCoordinator(new InMemoryStore())
    await this.leader.establishWhitelist()
    await this.leader.establishGroupPublicKey(threshold)
    await setTimeout(100)
    return this
  }

  async stop() { for (let each of this.nodes) await each.stop() }

  async addVault(chainId, vault) { this.nodes.forEach(_ => _.addVault(chainId, vault)) }
}
