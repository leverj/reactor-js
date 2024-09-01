import {ContractTracker} from '@leverj/chain-tracking'
import {logger} from '@leverj/common'
import {events} from '@leverj/reactor.chain/contracts'

const Transfer = events.Vault.Transfer.topic

export const VaultTracker = async (store, chainId, contract, polling, node) => {
  const {runner: {provider}, target: address} = contract
  const defaults = {contract, topics: Transfer}
  const processEvent = async _ => node.processTransfer(_.args)
  return ContractTracker.from(store, chainId, address, provider, defaults, polling, processEvent, logger)
}
