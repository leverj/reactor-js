import {AbiCoder} from 'ethers'

export * as abi from './abi/index.js'
export * as events from './events/index.js'
export * as stubs from './stubs.js'

export const encodeTransfer = (origin, token, name, symbol, decimals, amount, owner, from, to, tag) => AbiCoder.defaultAbiCoder().encode(
  ['uint64', 'address', 'string', 'string', 'uint8', 'uint', 'address', 'uint64', 'uint64', 'uint'],
  [origin, token, name, symbol, decimals, amount, owner, from, to, tag]
)
