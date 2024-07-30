import {BigNumber, utils} from 'ethers'

const {randomBytes, hexlify, hexZeroPad} = utils

export const FIELD_ORDER = BigNumber.from('0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd47')

export const toBig = (n) => BigNumber.from(n)

export const randHex = (n) => hexlify(randomBytes(n))

export const randBig = (n) => toBig(randomBytes(n))

export const bigToHex = (n) => hexZeroPad(n.toHexString(), 32)

export const randFs = () => randBig(32).mod(FIELD_ORDER)

export const randFsHex = () => bigToHex(randBig(32).mod(FIELD_ORDER))

export const P_PLUS1_OVER4 = BigNumber.from('0xc19139cb84c680a6e14116da060561765e05aa45a1c72a34f082305b61f3f52')
export function exp(a, e) {
  let z = BigNumber.from(1)
  let path = BigNumber.from('0x8000000000000000000000000000000000000000000000000000000000000000')
  for (let i = 0; i < 256; i++) {
    z = z.mul(z).mod(FIELD_ORDER)
    if (!e.and(path).isZero()) {
      z = z.mul(a).mod(FIELD_ORDER)
    }
    path = path.shr(1)
  }
  return z
}

export function sqrt(nn) {
  const n = exp(nn, P_PLUS1_OVER4)
  const found = n.mul(n).mod(FIELD_ORDER).eq(nn)
  return {n, found}
}

export const inverse = (a) => exp(a, FIELD_ORDER.sub(BigNumber.from('2')))

export const mulmod = (a, b) => a.mul(b).mod(FIELD_ORDER)

export function stringToHex(str) {
  let hex = ''
  for (let i = 0; i < str.length; i++) hex += '' + str.charCodeAt(i).toString(16)
  return '0x' + hex
}

