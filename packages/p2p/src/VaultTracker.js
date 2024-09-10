import {ContractTracker} from '@leverj/chain-tracking'

export const VaultTracker = async (contract, store, polling, node, logger = console) => {
  const chainId = await contract.runner.provider.getNetwork().then(_ => _.chainId)
  const processEvent = async _ => node.processTransfer(_.args)
  return ContractTracker.of(chainId, contract, store, polling, processEvent, logger)
}
