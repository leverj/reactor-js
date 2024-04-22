let ethers = require('ethers')
const {utils: {randomBytes, hexlify, hexZeroPad}, BigNumber} = ethers

const FIELD_ORDER = BigNumber.from('0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd47')

const ZERO = BigNumber.from('0')
const ONE = BigNumber.from('1')
const TWO = BigNumber.from('2')

function toBig(n) {
  return BigNumber.from(n)
}

function randHex(n) {
  return hexlify(randomBytes(n))
}

function randBig(n) {
  return toBig(randomBytes(n))
}

function bigToHex(n) {
  return hexZeroPad(n.toHexString(), 32)
}

function randFs() {
  const r = randBig(32)
  return r.mod(FIELD_ORDER)
}

function randFsHex() {
  const r = randBig(32)
  return bigToHex(r.mod(FIELD_ORDER))
}

const P_PLUS1_OVER4 = BigNumber.from('0xc19139cb84c680a6e14116da060561765e05aa45a1c72a34f082305b61f3f52')
//  const P_MINUS3_OVER4 = BigNumber.from('0xc19139cb84c680a6e14116da060561765e05aa45a1c72a34f082305b61f3f51');
//  const P_MINUS1_OVER2 = BigNumber.from('0x183227397098d014dc2822db40c0ac2ecbc0b548b438e5469e10460b6c3e7ea3');
function exp(a, e) {
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

function sqrt(nn) {
  const n = exp(nn, P_PLUS1_OVER4)
  const found = n.mul(n).mod(FIELD_ORDER).eq(nn)
  return {n, found}
}

function inverse(a) {
  const z = FIELD_ORDER.sub(TWO)
  return exp(a, z)
}

function mulmod(a, b) {
  return a.mul(b).mod(FIELD_ORDER)
}

module.exports = {
  FIELD_ORDER,
  ZERO,
  ONE,
  TWO,
  toBig,
  randHex,
  randBig,
  bigToHex,
  randFs,
  randFsHex,
  P_PLUS1_OVER4,
  exp,
  sqrt,
  inverse,
  mulmod,
}