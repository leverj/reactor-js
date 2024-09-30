import {ContractTracker} from '@leverj/chain-tracking'
import {encodeTransfer, stubs} from '@leverj/reactor.chain/contracts'
import {JsonRpcProvider} from 'ethers'
import {Map} from 'immutable'

export const VaultTracker = (chainId, contract, store, polling, actor, logger = console) => {
   return ContractTracker.of(chainId, contract, store, polling, _ => actor.onEvent(_), logger)
}

export class CrossChainVaultCoordinator {
  static ofEvms(evms, chains, store, polling, signer, wallet, logger = console) {
    signer.setupVaults(evms, chains)
    const vaults = Map(evms).
      filter(_ => chains.includes(_.label)).
      mapKeys(_ => BigInt(_)).
      map(_ => stubs.Vault(_.contracts.Vault.address, new JsonRpcProvider(_.providerURL)))
    return this.ofVaults(vaults, store, polling, signer, wallet, logger)
  }

  // note: for use by tests
  static ofVaults(vaults, store, polling, signer, wallet, logger = console) {
    return new this(vaults, store, polling, signer, wallet, logger)
  }

  constructor(vaults, store, polling, signer, wallet, logger) {
    this.vaults = vaults
    this.trackers = this.vaults.map((vault, id) => VaultTracker(id, vault, store, polling, this, logger)).valueSeq().toArray()
    this.signer = signer
    this.wallet = wallet
    this.logger = logger
    this.isRunning = false
  }
  get chainIds() { return this.vaults.keySeq().toArray() }

  async onEvent(event) {
    switch (event.name) {
      case 'Transfer':
        const {transferHash, origin, token, name, symbol, decimals, amount, owner, from, to, tag} = event.args
        const payload = encodeTransfer(origin, token, name, symbol, decimals, amount, owner, from, to, tag)
        const signature = await this.signer.sign(from, transferHash)
        const toVault = this.vaults.get(to)
        const runner = toVault.connect(this.wallet.connect(toVault.runner.provider))
        await runner.accept(signature, this.signer.publicKey, payload).then(_ => _.wait())
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
