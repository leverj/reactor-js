import {BigNumber, utils} from 'ethers'

const {randomBytes, hexlify, hexZeroPad} = utils

export const FIELD_ORDER = BigNumber.from('0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd47')

export const toBig = (n) => BigNumber.from(n)

export const randHex = (n) => hexlify(randomBytes(n))

export const bigToHex = (n) => hexZeroPad(n.toHexString(), 32)

export function stringToHex(str) {
  let hex = ''
  for (let i = 0; i < str.length; i++) hex += '' + str.charCodeAt(i).toString(16)
  return '0x' + hex
}

