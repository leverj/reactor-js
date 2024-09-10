import {InMemoryStore, logger} from '@leverj/common'
import {stubs} from '@leverj/reactor.chain/contracts'
import {JsonRpcProvider} from 'ethers'
import {Map} from 'immutable'
import {VaultTracker} from '../src/VaultTracker.js'

export class MultiChainVaultTracker {
  static of(chains, store, polling, node, logger = console) {
    const networks = Map(store.toObject()).filter(_ => chains.includes(_.label)).map(_ => ({
      id: _.id,
      label: _.label,
      provider: new JsonRpcProvider(_.providerURL),
      Vault: _.contracts.Vault,
    }))
    return new this(networks, polling, node, logger)
  }

  constructor(networks, node, polling) {
    this.networks = networks
    this.polling = polling
    this.node = node
    this.logger = logger
    this.trackers = []
  }

  async start() {
    for (let each of this.networks.map(_ => stubs.Vault(_.Vault.address, _.provider))) {
      const store = new InMemoryStore()
      this.trackers.push(await VaultTracker(each, store, this.polling, this.node, this.logger))
    }
  }

  stop() {
    //fixme: stop trackers
  }
}
