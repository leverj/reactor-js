import {events} from '@leverj/reactor.chain/contracts'
import {Tracker, TrackerMarker} from '@leverj/reactor.chain/tracking'

export class VaultTracker extends Tracker {
  static async of(node, contract, store, polling) {
    const chainId = await contract.provider.getNetwork().then(_ => _.chainId)
    const marker = TrackerMarker.of(store, chainId)
    return new this(node, contract, marker, polling)
  }

  constructor(node, contract, marker, polling) {
    super(contract, events.Vault.Transfer.topic, marker, polling)
    this.node = node
  }

  async processLog(log) { return this.node.processTransfer(log.args) }
}
