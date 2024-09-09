import {ContractTracker} from '@leverj/chain-tracking'
import {InMemoryStore, logger} from '@leverj/common'
import {stubs} from '@leverj/reactor.chain/contracts'
import {JsonRpcProvider} from 'ethers'
import {Map} from 'immutable'
import {VaultTracker} from '../src/VaultTracker.js'

export class MultiChainContractCoordinator {
  static of(chains, store, polling) {
    const networks = Map(store.toObject).filter(_ => chains.includes(_.label)).map(_ => ({
      id: _.id,
      label: _.label,
      Vault: _.contracts.Vault,
      provider: new JsonRpcProvider(_.providerURL),
    }))
    const contracts = networks.map(_ => stubs.Vault(_.Vault.address, _.provider))
    return new this(contracts, polling)
  }

  constructor(contracts, polling) {
    this.contracts = contracts
    this.polling = polling
    this.trackers = []
  }

  async load() {
    const node = null //fixme
    for (let each of this.contracts) {
      const store = new InMemoryStore()
      this.trackers.push(await VaultTracker(each, store, this.polling, node))
    }
  }

  async start() {
  }

  stop() {
    //fixme: stop trackers
  }
}
