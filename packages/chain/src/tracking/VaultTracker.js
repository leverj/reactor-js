import {events} from '@leverj/reactor.chain/contracts'
import {Tracker} from './Tracker.js'

const Transfer = events.Vault.Transfer.topic

export class VaultTracker extends Tracker {
  static of(contract, polling, marker, node) {
    return new this(contract, polling, marker, _ => node.processTransfer(_.args))
  }

  constructor(contract, polling, marker, processLog) {
    super(contract, Transfer, polling, marker, processLog)
  }
}
