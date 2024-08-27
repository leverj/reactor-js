import {Tracker} from '@leverj/chain-tracking'
import {logger} from '@leverj/common/utils'
import {events} from '@leverj/reactor.chain/contracts'

const Transfer = events.Vault.Transfer.topic

export const VaultTracker = async (factory, contract, polling, node) =>
  Tracker.from(factory, contract, Transfer, polling, _ => node.processTransfer(_.args), logger)
