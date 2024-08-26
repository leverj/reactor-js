import {events} from '@leverj/reactor.chain/contracts'
import {Tracker} from './Tracker.js'

const Transfer = events.Vault.Transfer.topic

export const VaultTracker = (store, chainId, contract, polling, node) =>
  new Tracker(store, chainId, contract, Transfer, polling, _ => node.processTransfer(_.args))
