import {events} from '@leverj/reactor.chain/contracts'
import {Tracker, TrackerMarker} from '@leverj/reactor.chain/tracking'

export class VaultTracker extends Tracker {
  static async of(contract, polling, store, node) {
    const chainId = await contract.runner.provider.getNetwork().then(_ => _.chainId)
    const marker = TrackerMarker.of(store, chainId)
    return new this(contract, polling, marker, _ => node.processTransfer(_.args))
  }

  constructor(contract, polling, marker, processLog) {
    super(contract, events.Vault.Transfer.topic, polling, marker, processLog)
  }
}
