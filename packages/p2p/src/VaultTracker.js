import {ContractTracker} from '@leverj/chain-tracking'
import {logger} from '@leverj/common'

export const VaultTracker = async (contract, store, polling, node) => {
  const chainId = await contract.runner.provider.getNetwork().then(_ => _.chainId)
  const processEvent = async _ => node.processTransfer(_.args)
  return ContractTracker.of(chainId, contract, store, polling, processEvent, logger)
}
