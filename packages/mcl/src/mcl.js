import {bigToHex, FIELD_ORDER, randHex, stringToHex, toBig} from './utils.js'
import {hashToField} from './hash_to_field.js'
import mcl from 'mcl-wasm'
import bls from '@leverj/layer2-p2p/src/utils/bls.js'

export {stringToHex} from './utils.js'
export * from 'mcl-wasm'
export const MAPPING_MODE_TI = 'TI'
export const MAPPING_MODE_FT = 'FT'
const cipher_suite_domain = 'BN256-HASHTOPOINT';
export const DOMAIN_STRING = cipher_suite_domain
let DOMAIN

export async function init() {
  await mcl.init(mcl.BN_SNARK1)
  setMappingMode(MAPPING_MODE_FT)
  setDomain(DOMAIN_STRING)
}

export function setDomain(domain) {
  DOMAIN = Uint8Array.from(Buffer.from(domain, 'utf8'))
}

export function setDomainHex(domain) {
  DOMAIN = Uint8Array.from(Buffer.from(domain, 'hex'))
}

export function setMappingMode(mode) {
  if (mode === MAPPING_MODE_FT) {
    mcl.setMapToMode(0)
  } else if (mode === MAPPING_MODE_TI) {
    mcl.setMapToMode(1)
  } else {
    throw new Error('unknown mapping mode')
  }
}

export function hashToPoint(msg) {
  // return mcl.hashAndMapToG1(msg)

  // if (!ethers.utils.isHexString(msg)) {
  //   throw new Error('message is expected to be hex string')
  // }

  const _msg = Uint8Array.from(Buffer.from(stringToHex(msg).slice(2), 'hex'))
  const hashRes = hashToField(DOMAIN, _msg, 2)
  const e0 = hashRes[0]
  const e1 = hashRes[1]
  const p0 = mapToPoint(e0.toHexString())
  const p1 = mapToPoint(e1.toHexString())
  const p = mcl.add(p0, p1)
  p.normalize()
  return p
}

export function mapToPoint(eHex) {
  const e0 = toBig(eHex)
  let e1 = new mcl.Fp()
  e1.setStr(e0.mod(FIELD_ORDER).toString())
  return e1.mapToG1()
}

export function mclToHex(p, prefix = true) {
  const arr = p.serialize()
  let s = ''
  for (let i = arr.length - 1; i >= 0; i--) {
    s += ('0' + arr[i].toString(16)).slice(-2)
  }
  return prefix ? '0x' + s : s
}

export function g1() {
  const g1 = new mcl.G1()
  g1.setStr('1 0x01 0x02', 16)
  return g1
}

export function g2() {
  const g2 = new mcl.G2()
  g2.setStr(
    '1 0x1800deef121f1e76426a00665e5c4479674322d4f75edadd46debd5cd992f6ed 0x198e9393920d483a7260bfb731fb5d25f1aa493335a9e71297e485b7aef312c2 0x12c85ea5db8c6deb4aab71808dcb408fe3d1e7690c43d37b4ce6cc0166fa7daa 0x090689d0585ff075ec9e99ad690c3395bc4b313370b38ef355acdadcd122975b'
  )
  return g2
}

export function getPublicKey(secret) {
  let fr = secretFromHex(secret)
  const pubkey = mcl.mul(g2(), fr)
  pubkey.normalize()
  return pubkey
}

export function secretFromHex(secretHex) {
  return mcl.deserializeHexStrToFr(secretHex)
}

export function signOfG1(p) {
  const y = toBig(mclToHex(p.getY()))
  const ONE = toBig(1)
  return y.and(ONE).eq(ONE)
}

export function signOfG2(p) {
  p.normalize()
  const y = mclToHex(p.getY(), false)
  const ONE = toBig(1)
  return toBig('0x' + y.slice(64))
    .and(ONE)
    .eq(ONE)
}

export function g1ToCompressed(p) {
  const MASK = toBig('0x8000000000000000000000000000000000000000000000000000000000000000')
  p.normalize()
  if (signOfG1(p)) {
    const x = toBig(mclToHex(p.getX()))
    const masked = x.or(MASK)
    return bigToHex(masked)
  } else {
    return mclToHex(p.getX())
  }
}

export function g1ToBN(p) {
  p.normalize()
  const x = toBig(mclToHex(p.getX()))
  const y = toBig(mclToHex(p.getY()))
  return [x, y].map(_=>_.toString())
}

export function g1ToHex(p) {
  p.normalize()
  const x = mclToHex(p.getX())
  const y = mclToHex(p.getY())
  return [x, y]
}

export function g2ToCompressed(p) {
  const MASK = toBig('0x8000000000000000000000000000000000000000000000000000000000000000')
  p.normalize()
  const x = mclToHex(p.getX(), false)
  if (signOfG2(p)) {
    const masked = toBig('0x' + x.slice(64)).or(MASK)
    return [bigToHex(masked), '0x' + x.slice(0, 64)]
  } else {
    return ['0x' + x.slice(64), '0x' + x.slice(0, 64)]
  }
}

export function g2ToBN(p) {
  const x = mclToHex(p.getX(), false)
  const y = mclToHex(p.getY(), false)
  return [
    toBig('0x' + x.slice(64)),
    toBig('0x' + x.slice(0, 64)),
    toBig('0x' + y.slice(64)),
    toBig('0x' + y.slice(0, 64)),
  ].map(_=>_.toString())
}

export function g2ToHex(p) {
  p.normalize()
  const x = mclToHex(p.getX(), false)
  const y = mclToHex(p.getY(), false)
  return ['0x' + x.slice(64), '0x' + x.slice(0, 64), '0x' + y.slice(64), '0x' + y.slice(0, 64)]
}

export function newKeyPair() {
  const secret = randFr()
  const pubkey = mcl.mul(g2(), secret)
  pubkey.normalize()
  return {pubkey, secret}
}

export function sign(message, secret) {
  const M = hashToPoint(message)
  const signature = mcl.mul(M, secret)
  signature.normalize()
  return {signature, M}
}

export function aggreagate(acc, other) {
  const _acc = mcl.add(acc, other)
  _acc.normalize()
  return _acc
}

export function compressPubkey(p) {
  return g2ToCompressed(p)
}

export function compressSignature(p) {
  return g1ToCompressed(p)
}

export function newG1() {
  return new mcl.G1()
}

export function newG2() {
  return new mcl.G2()
}

export function randFr() {
  const r = randHex(12)
  let fr = new mcl.Fr()
  fr.setHashOf(r)
  return fr
}

export function randG1() {
  const p = mcl.mul(g1(), randFr())
  p.normalize()
  return p
}

export function randG2() {
  const p = mcl.mul(g2(), randFr())
  p.normalize()
  return p
}

/*------------------------------- BLS extension -------------------------------*/

export const deserializeHexStrToSecretKey = (hex) => mcl.deserializeHexStrToFr(hex)
export const deserializeHexStrToPublicKey = (hex) => mcl.deserializeHexStrToG2(hex)
export const deserializeHexStrToSignature = (hex) => mcl.deserializeHexStrToG1(hex)

export const SecretKey = mcl.Fr
mcl.Fr.prototype.getPublicKey = function () {
  return getPublicKey(this.serializeToHexStr())
}

mcl.Fr.prototype.share = function (vec, id) {
  const shared = mcl.shareFr(vec, id)
  this.setStr(shared.getStr())
}

mcl.Fr.prototype.add = function (sk) {
  const added = mcl.add(sk, this)
  this.setStr(added.getStr())
}

mcl.Fr.prototype.sign = function (msg) {
  return sign(msg, this).signature
}

export const PublicKey = mcl.G2
mcl.G2.prototype.share = function (vec, id) {
  const shared = mcl.shareG2(vec, id)
  this.setStr(shared.getStr())
}

mcl.G2.prototype.add = function (pk) {
  const added = mcl.add(pk, this)
  this.setStr(added.getStr())
}

// fast and copy from mcl-wasm c++ code
mcl.G2.prototype.verify = function (signature, msg) {
  // let H = mcl.hashAndMapToG1(msg)  // does not have domain, so does not work. to be worked later
  let H = hashToPoint(msg) // has domain
  H = mcl.neg(H)
  let e1 = mcl.precomputedMillerLoop(signature, new mcl.PrecomputedG2(g2()))
  const e2 = mcl.millerLoop(H, this)
  e1 = mcl.mul(e1, e2)
  e1 = mcl.finalExp(e1)
  return e1.isOne()
}

// slow but clean
mcl.G2.prototype.verify_slow = function (signature, msg) {
  const M = hashToPoint(msg)
  const preComputedG2 = mcl.neg(g2())
  const messageToPublicKeyPairing = mcl.pairing(M, this)
  const messageToPrecomputedG2Pairing = mcl.pairing(signature, preComputedG2)
  return mcl.mul(messageToPublicKeyPairing, messageToPrecomputedG2Pairing).isOne()
}

export const Signature = mcl.G1
mcl.G1.prototype.recover = function (signs, signers) {
  let groupSignature = mcl.recoverG1(signers, signs)
  this.setStr(groupSignature.getStr())
}
