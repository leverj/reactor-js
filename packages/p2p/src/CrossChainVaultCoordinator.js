import {ContractTracker} from '@leverj/chain-tracking'
import {stubs} from '@leverj/reactor.chain/contracts'
import {JsonRpcProvider} from 'ethers'
import {Map} from 'immutable'

export const VaultTracker = (chainId, contract, store, polling, actor, logger = console) => {
  const onEvent = async _ => actor.processTransfer(_.args)
  return ContractTracker.of(chainId, contract, store, polling, onEvent, logger)
}

export class CrossChainVaultCoordinator {
  static of(chains, evms, store, polling, actor, logger = console) {
    const networks = Map(evms).filter(_ => chains.includes(_.label)).map(_ => ({
      id: _.id,
      label: _.label,
      provider: new JsonRpcProvider(_.providerURL),
      Vault: _.contracts.Vault,
    }))
    return new this(networks, store, polling, actor, logger)
  }

  constructor(networks, store, polling, actor, logger) {
    this.networks = networks
    this.store = store
    this.polling = polling
    this.actor = actor
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
      const tracker = VaultTracker(_.id, contract, this.store, this.polling, this.actor, this.logger)
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
