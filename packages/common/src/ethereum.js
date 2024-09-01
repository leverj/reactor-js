import {AbiCoder, getAddress, solidityPackedKeccak256} from 'ethers'

export {getAddress, verifyMessage, isAddress} from 'ethers'

BigInt.prototype.toJSON = function () { return this.toString() }

export const uint = BigInt
export const abi = AbiCoder.defaultAbiCoder()
export const address = getAddress
export const keccak256 = (subject) => solidityPackedKeccak256(['string'], [subject.toString()])
export const normalizeAddresses = (object, ...addresses) => {
  for (let key of addresses) if (object[key]) object[key] = getAddress(object[key])
  return object
}
