import {InMemoryStore} from '@leverj/lever.common'
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
    const {bridge: {threshold}} = this.config
    await this.createNodes()
    for (let each of this.nodes) await each.start()
    this.leader.setupCoordinator(new InMemoryStore())
    await this.leader.establishWhitelist()
    await this.leader.establishGroupPublicKey(threshold)
    await setTimeout(100)
    return this
  }

  async stop() { for (let each of this.nodes) await each.stop() }

  async createNodes() {
    const {port: leaderPort, bridge: {threshold}} = this.config
    const bootstrapNodes = []
    for (let i = 0; i < threshold + 1; i++) {
      const data = {p2p: peerIdJsons[i]}
      const node = await BridgeNode.from(this.config, leaderPort + i, bootstrapNodes, data)
      if (i === 0) bootstrapNodes.push(node.multiaddrs[0])
      this.nodes.push(node)
    }
  }

  async addVaultToAllNodes(chainId, vault) {
    for (let each of this.nodes) await each.addVault(chainId, vault)
  }

  async addVault(chainId, vault) {
    await this.addVaultToAllNodes(chainId, vault)
    await this.leader.coordinator.addVault(chainId, vault)
  }
}
