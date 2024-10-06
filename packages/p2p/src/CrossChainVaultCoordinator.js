import {ContractTracker} from '@leverj/chain-tracking'
import {logger, Mutex} from '@leverj/common'
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
    this.mutex = new Mutex()
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
      case 'Transfer': return this.onTransfer(event)
    }
  }

  async onTransfer(event) {
    const {transferHash, origin, token, name, symbol, decimals, amount, owner, from, to, tag} = event.args
    const payload = encodeTransfer(origin, token, name, symbol, decimals, amount, owner, from, to, tag)
    const signature = await this.signer.sign(from, transferHash)
    return signature ?
      this.accept(this.vaults.get(to), signature, this.signer.publicKey, payload) :
      logger.error(`unable to aggregate signature for ${transferHash} on chain ${from}`)
  }

  async accept(toVault, signature, publicKey, payload) {
    return this.mutex.synchronize(() => {
      toVault = toVault.connect(this.wallet.connect(toVault.runner.provider))
      return toVault.accept(signature, publicKey, payload).then(_ => _.wait())
    })
  }

  async start() {
    if (this.isRunning) return

    logger.log(`starting cross-chain Vault tracking for [${this.chainIds}]`)
    this.isRunning = true
    for (let each of this.trackers) await each.start()
  }

  async stop() {
    if (!this.isRunning) return

    logger.log(`stopping cross-chain Vault tracking for [${this.chainIds}]`)
    this.isRunning = false
    for (let each of this.trackers) each.stop()
  }
}
