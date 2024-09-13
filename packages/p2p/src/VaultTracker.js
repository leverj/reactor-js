import {ContractTracker} from '@leverj/chain-tracking'

export const VaultTracker = (config, chainId, contract, store, actor, logger = console) => {
  const {chain: {polling}} = config
  return ContractTracker.of(chainId, contract, store, polling, _ => actor.onEvent(_), logger)
}
