import {ZeroAddress, ZeroHash} from 'ethers'

export const MinHash = ZeroHash
export const MaxHash = `0x${'f'.repeat(64)}`
export const ETH = ZeroAddress
export const address_0 = ZeroAddress
export const bytes32_0 = ZeroHash
export const zero = BigInt(MinHash)

//fixme: remove unused and consolidate with ethereum.js
