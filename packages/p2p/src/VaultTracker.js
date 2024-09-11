import {ContractTracker} from '@leverj/chain-tracking'
import config from '../config.js'

const {chain: {polling}} = config

export const VaultTracker = (chainId, contract, store, actor, logger = console) => {
  return ContractTracker.of(chainId, contract, store, polling, _ => actor.onEvent(_), logger)
}
