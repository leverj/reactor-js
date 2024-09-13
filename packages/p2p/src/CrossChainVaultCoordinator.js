import {ContractTracker} from '@leverj/chain-tracking'
import {encodeTransfer, stubs} from '@leverj/reactor.chain/contracts'
import {publicKey, signedBy, signer} from '@leverj/reactor.chain/test'
import {JsonRpcProvider} from 'ethers'
import {Map} from 'immutable'
import config from '../config.js'

const {chain: {polling}} = config

export const VaultTracker = (chainId, contract, store, actor, logger = console) => {
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
        console.log(event.name, contract.target, {signature, publicKey, payload})
        const provider = contract.runner.provider
        const runner = contract.connect(this.signer.connect(provider))
        return runner.checkIn(signature, publicKey, payload).then(_ => _.wait())
    }
  }
}

export class CrossChainVaultCoordinator {
  static of(chains, evms, store, signer, logger = console) {
    // fixme: affirm evms includes all of chains
    const networks = Map(evms).filter(_ => chains.includes(_.label)).map(_ => ({
      id: BigInt(_.id),
      label: _.label,
      provider: new JsonRpcProvider(_.providerURL),
      Vault: _.contracts.Vault,
    }))
    const chains_ = networks.keySeq().toArray()
    const networks_ = networks.valueSeq().toArray()
    return new this(chains_, networks_, store, signer, logger)
  }

  constructor(chains, networks, store, signer, logger) {
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
    this.contracts = Map().asMutable()
    this.contracts = Map().asMutable()
    this.trackers = []
    this.networks.forEach(_ => {
      const contract = stubs.Vault(_.Vault.address, _.provider)
      const tracker = VaultTracker(_.id, contract, this.store, this, this.logger)
      this.contracts.set(_.id, contract)
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
