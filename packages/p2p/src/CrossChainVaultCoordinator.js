import {ContractTracker} from '@leverj/chain-tracking'
import {encodeTransfer, stubs} from '@leverj/reactor.chain/contracts'
import {publicKey, signedBy, signer} from '@leverj/reactor.chain/test'
import {JsonRpcProvider} from 'ethers'
import {Map} from 'immutable'

export const VaultTracker = (chainId, contract, store, polling, actor, logger = console) => {
   return ContractTracker.of(chainId, contract, store, polling, _ => actor.onEvent(_), logger)
}

export class Actor {
  constructor (signer) {
    this.signer = signer
  }
  async actOn(event, contract, parameters) {
    switch (event.name) {
      case 'Transfer':
        const {signature, publicKey, payload} = parameters
        const provider = contract.runner.provider
        await contract.connect(this.signer.connect(provider)).accept(signature, publicKey, payload).then(_ => _.wait())
    }
  }
}

export class CrossChainVaultCoordinator {
  static of(chains, evms, store, polling, signer, logger = console) {
    // fixme: affirm evms includes all of chains
    const networks = Map(evms).filter(_ => chains.includes(_.label)).map(_ => ({
      id: BigInt(_.id),
      label: _.label,
      provider: new JsonRpcProvider(_.providerURL),
      Vault: _.contracts.Vault,
    })).valueSeq().toArray()
    return new this(chains, networks, store, polling, signer, logger)
  }

  constructor(chains, networks, store, polling, signer, logger) {
    this.polling = polling
    this.chains = chains
    this.networks = networks
    this.store = store
    this.actor = new Actor(signer)
    this.logger = logger
    this.isRunning = false
  }

  async onEvent(event) {
    switch (event.name) {
      case 'Transfer':
        const {transferHash, origin, token, name, symbol, decimals, amount, owner, from, to, tag} = event.args
        const payload = encodeTransfer(origin, token, name, symbol, decimals, amount, owner, from, to, tag)
        const signature = signedBy(transferHash, signer)
        const toVault = this.contracts.get(to)
        return this.actor.actOn(event, toVault, {signature, publicKey, payload})
    }
  }

  async start() {
    if (this.isRunning) return

    this.logger.log(`starting cross-chain Vault tracking for [${this.chains}]`)
    this.isRunning = true
    this.contracts = Map(this.networks.map(_ => [_.id, stubs.Vault(_.Vault.address, _.provider)]))
    this.trackers = this.contracts.map((contract, id) => VaultTracker(id, contract, this.store, this.polling, this, this.logger)).valueSeq().toArray()
    for (let each of this.trackers) await each.start()
  }

  stop() {
    if (!this.isRunning) return

    this.logger.log(`stopping cross-chain Vault tracking for [${this.chains}]`)
    this.isRunning = false
    for (let each of this.trackers) each.stop()
  }
}
