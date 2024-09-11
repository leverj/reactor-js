import {ContractTracker} from '@leverj/chain-tracking'
import {logger} from '@leverj/common'
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
    // this.signer.connect(provider)
    contract.connect(this.signer)

    switch (event.name) {
      case 'Transfer':
        const {signature, publicKey, payload} = parameters
        logger.log(event.name, contract.target, {signature, publicKey, payload})
        return contract.checkIn(signature, publicKey, payload).then(_ => _.wait())
    }
  }
}

export class CrossChainVaultCoordinator {
  static of(chains, evms, store, signer, logger = console) {
    const networks = Map(evms).filter(_ => chains.includes(_.label)).map(_ => ({
      id: BigInt(_.id),
      label: _.label,
      provider: new JsonRpcProvider(_.providerURL),
      Vault: _.contracts.Vault,
    }))
    return new this(networks, store, signer, logger)
  }

  constructor(networks, store, signer, logger) {
    this.networks = networks
    this.store = store
    this.actor = new Actor(signer)
    this.logger = logger
    this.isRunning = false
  }
  get chains() { return this.networks.keySeq().toArray() }

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
    this.trackers = []
    this.networks.forEach(_ => {
      const contract = stubs.Vault(_.Vault.address, _.provider)
      const tracker = VaultTracker(_.id, contract, this.store, this.actor, this.logger)
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
