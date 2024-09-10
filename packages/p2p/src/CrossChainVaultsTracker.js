import {ContractTracker} from '@leverj/chain-tracking'
import {InMemoryStore, JsonStore, logger} from '@leverj/common'
import {stubs} from '@leverj/reactor.chain/contracts'
import {JsonRpcProvider} from 'ethers'
import {Map} from 'immutable'

export const VaultTracker = (chainId, contract, store, polling, node, logger = console) => {
  const processEvent = async _ => node.processTransfer(_.args)
  return ContractTracker.of(chainId, contract, store, polling, processEvent, logger)
}

export class CrossChainVaultsTracker {
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
    this.isRunning = false
  }
  get chains() { return this.networks.keySeq().toArray() }

  async start() {
    if (this.isRunning) return

    this.logger.log(`starting cross-chain Vault tracking for [${this.chains}]`)
    this.isRunning = true
    this.trackers = []
    this.networks.forEach(_ => {
      const contract = stubs.Vault(_.Vault.address, _.provider)
      const storeX = new JsonStore(deployedDir, '.evms')

      const store = new InMemoryStore() //fixme: how to create the right store?
      const tracker = VaultTracker(_.id, contract, store, this.polling, this.node, this.logger)
      this.trackers.push(tracker)
    })
  }

  stop() {
    if (!this.isRunning) return

    this.logger.log(`stopping cross-chain Vault tracking for [${this.chains}]`)
    this.isRunning = false
    this.trackers.forEach(_ => _.stop())
  }
}
