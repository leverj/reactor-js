import {ContractTracker} from '@leverj/chain-tracking'
import {logger} from '@leverj/common'
import {encodeTransfer} from '@leverj/reactor.chain/contracts'

export const VaultTracker = (chainId, contract, store, polling, actor) => {
  return ContractTracker.of(chainId, contract, store, polling, _ => actor.onEvent(_), logger)
}

export class CrossChainVaultCoordinator {
  constructor(vaults, store, polling, signer, wallet) {
    this.vaults = vaults
    this.store = store
    this.polling = polling
    this.signer = signer
    this.wallet = wallet
    this.isRunning = false
    this.trackers = []
    this.vaults.forEach((vault, chainId) => this.addTracker(chainId, vault))
  }
  get chainIds() { return this.vaults.keySeq().toArray() }

  addVault(chainId, vault) {
    this.vaults.set(chainId, vault)
    this.addTracker(chainId, vault)
  }

  addTracker(chainId, vault) {
    const tracker = VaultTracker(chainId, vault, this.store, this.polling, this)
    this.trackers.push(tracker)
    if (this.isRunning) tracker.start().catch(logger.error)
  }

  async onEvent(event) {
    switch (event.name) {
      case 'Transfer':
        const {transferHash, origin, token, name, symbol, decimals, amount, owner, from, to, tag} = event.args
        const payload = encodeTransfer(origin, token, name, symbol, decimals, amount, owner, from, to, tag)
        const signature = await this.signer.sign(from, transferHash)
        if (!signature) return logger.error(`unable to aggregate signature for ${transferHash} on chain ${from}`)
        const toVault = this.vaults.get(to)
        const wallet = this.wallet.connect(toVault.runner.provider)
        const runner = toVault.connect(wallet)
        //fixme: need to queue accepts, due to possible race conditions ('Nonce too low' error)
        await runner.accept(signature, this.signer.publicKey, payload).then(_ => _.wait())
    }
  }

  async start() {
    if (this.isRunning) return

    //fixme.coordinator: need to load state of vaults & trackers
    logger.log(`starting cross-chain Vault tracking for [${this.chainIds}]`)
    this.isRunning = true
    for (let each of this.trackers) await each.start()
  }

  async stop() {
    if (!this.isRunning) return

    //fixme.coordinator: need to save state of vaults & trackers
    logger.log(`stopping cross-chain Vault tracking for [${this.chainIds}]`)
    this.isRunning = false
    for (let each of this.trackers) each.stop()
  }
}
