import {getAddress, solidityPackedKeccak256, ZeroAddress, ZeroHash} from 'ethers'

export {getAddress, verifyMessage, isAddress} from 'ethers'

BigInt.prototype.toJSON = function () { return this.toString() }

export const uint = BigInt
export const address = getAddress
export const keccak256 = (subject) => solidityPackedKeccak256(['string'], [subject.toString()])
export const MinHash = ZeroHash
export const MaxHash = `0x${'f'.repeat(64)}`
export const ETH = ZeroAddress
