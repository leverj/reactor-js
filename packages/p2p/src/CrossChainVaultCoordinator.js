import {ContractTracker} from '@leverj/chain-tracking'
import {encodeTransfer, stubs} from '@leverj/reactor.chain/contracts'
import {JsonRpcProvider} from 'ethers'
import {Map} from 'immutable'

export const VaultTracker = (chainId, contract, store, polling, actor, logger = console) => {
   return ContractTracker.of(chainId, contract, store, polling, _ => actor.onEvent(_), logger)
}

export class CrossChainVaultCoordinator {
  static ofEvms(evms, chains, store, polling, signer, wallet, logger = console) {
    const networks = Map(evms).filter(_ => chains.includes(_.label)).map(_ => ({
      id: BigInt(_.id),
      label: _.label,
      provider: new JsonRpcProvider(_.providerURL),
      Vault: _.contracts.Vault,
    })).valueSeq().toArray()
    const vaults = Map(networks.map(_ => [_.id, stubs.Vault(_.Vault.address, _.provider)]))
    return this.ofVaults(networks.map(_ => _.id), vaults, store, polling, signer, wallet, logger)
  }

  static ofVaults(chainIds, vaults, store, polling, signer, wallet, logger = console) {
    // fixme:chains: affirm vaults includes all of chainIds
    return new this(chainIds, vaults, store, polling, signer, wallet, logger)
  }

  constructor(chainIds, vaults, store, polling, signer, wallet, logger) {
    this.chainIds = chainIds
    this.vaults = vaults
    this.trackers = this.vaults.map((vault, id) => VaultTracker(id, vault, store, polling, this, logger)).valueSeq().toArray()
    this.signer = signer
    this.wallet = wallet
    this.logger = logger
    this.isRunning = false
  }

  async onEvent(event) {
    switch (event.name) {
      case 'Transfer':
        const {transferHash, origin, token, name, symbol, decimals, amount, owner, from, to, tag} = event.args
        const payload = encodeTransfer(origin, token, name, symbol, decimals, amount, owner, from, to, tag)
        const {signature, publicKey} = await this.signer.sign(transferHash)
        const toVault = this.vaults.get(to)
        const runner = toVault.connect(this.wallet.connect(toVault.runner.provider))
        await runner.accept(signature, publicKey, payload).then(_ => _.wait())
    }
  }

  async start() {
    if (this.isRunning) return

    this.logger.log(`starting cross-chain Vault tracking for [${this.chainIds}]`)
    this.isRunning = true
    for (let each of this.trackers) await each.start()
  }

  stop() {
    if (!this.isRunning) return

    this.logger.log(`stopping cross-chain Vault tracking for [${this.chainIds}]`)
    this.isRunning = false
    for (let each of this.trackers) each.stop()
  }
}
