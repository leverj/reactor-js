import {ContractTracker} from '@leverj/chain-tracking'
import {encodeTransfer, stubs} from '@leverj/reactor.chain/contracts'
import {JsonRpcProvider} from 'ethers'
import {Map} from 'immutable'

export const VaultTracker = (chainId, contract, store, polling, actor, logger = console) => {
   return ContractTracker.of(chainId, contract, store, polling, _ => actor.onEvent(_), logger)
}

export class CrossChainVaultCoordinator {
  static ofEvms(evms, chains, store, polling, verifier, wallet, logger = console) {
    const networks = Map(evms).filter(_ => chains.includes(_.label)).map(_ => ({
      id: BigInt(_.id),
      label: _.label,
      provider: new JsonRpcProvider(_.providerURL),
      Vault: _.contracts.Vault,
    })).valueSeq().toArray()
    return this.ofNetworks(networks, chains, store, polling, verifier, wallet, logger)
  }

  static ofNetworks(networks, chains, store, polling, verifier, wallet, logger = console) {
    // fixme:chains: affirm evms includes all of chains
    return new this(networks.filter(_ => chains.includes(_.label)), store, polling, verifier, wallet, logger)
  }

  constructor(networks, store, polling, verifier, wallet, logger) {
    this.networks = networks
    this.vaults = Map(networks.map(_ => [_.id, stubs.Vault(_.Vault.address, _.provider)]))
    this.trackers = this.vaults.map((vault, id) => VaultTracker(id, vault, store, polling, this, logger)).valueSeq().toArray()
    this.verifier = verifier
    this.wallet = wallet
    this.logger = logger
    this.isRunning = false
  }
  get chains() { return this.networks.map(_ => _.id) }

  async onEvent(event) {
    switch (event.name) {
      case 'Transfer':
        const {transferHash, origin, token, name, symbol, decimals, amount, owner, from, to, tag} = event.args
        const payload = encodeTransfer(origin, token, name, symbol, decimals, amount, owner, from, to, tag)
        const {signature, publicKey} = await this.verifier.verify(transferHash)
        const toVault = this.vaults.get(to)
        const runner = toVault.connect(this.wallet.connect(toVault.runner.provider))
        await runner.accept(signature, publicKey, payload).then(_ => _.wait())
    }
  }

  async start() {
    if (this.isRunning) return

    this.logger.log(`starting cross-chain Vault tracking for [${this.chains}]`)
    this.isRunning = true
    for (let each of this.trackers) await each.start()
  }

  stop() {
    if (!this.isRunning) return

    this.logger.log(`stopping cross-chain Vault tracking for [${this.chains}]`)
    this.isRunning = false
    for (let each of this.trackers) each.stop()
  }
}
