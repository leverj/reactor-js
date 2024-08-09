import {BigNumber} from '@ethersproject/bignumber'
import {arrayify as getBytes, hexlify as toBeHex, zeroPad as zeroPadValue} from '@ethersproject/bytes'
import {randomBytes} from '@ethersproject/random'
// import {getBytes, toBeHex, zeroPadValue, randomBytes} from 'ethers'
import {sha256} from '@ethersproject/sha2'
import mcl from 'mcl-wasm'

await mcl.init(mcl.BN_SNARK1)
mcl.setMapToMode(0) // => 'FT'
// mcl.setMapToMode(1) // => 'TI'

export const deserializeHexStrToSecretKey = mcl.deserializeHexStrToFr
export const deserializeHexStrToPublicKey = mcl.deserializeHexStrToG2
export const deserializeHexStrToSignature = mcl.deserializeHexStrToG1

export function stringToHex(str) {
  let hex = ''
  for (let i = 0; i < str.length; i++) hex += '' + str.charCodeAt(i).toString(16)
  return '0x' + hex
}

const FIELD_ORDER = BigNumber.from('0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd47')

function hashToField(domain, msg, count) {
  const u = 48
  const _msg = expandMsg(domain, msg, count * u)
  const els = []
  for (let i = 0; i < count; i++) {
    const value = BigNumber.from(_msg.slice(i * u, (i + 1) * u))
    const el = value.mod(FIELD_ORDER)
    els.push(el)
  }
  return els
}

function expandMsg(domain, msg, outLen) {
  if (domain.length > 255) throw Error('bad domain size')

  const out = new Uint8Array(outLen)
  const len0 = 64 + msg.length + 2 + 1 + domain.length + 1
  const in0 = new Uint8Array(len0)
  // zero pad
  let off = 64
  // msg
  in0.set(msg, off)
  off += msg.length
  // l_i_b_str
  in0.set([(outLen >> 8) & 0xff, outLen & 0xff], off)
  off += 2
  // I2OSP(0, 1)
  in0.set([0], off)
  off += 1
  // DST_prime
  in0.set(domain, off)
  off += domain.length
  in0.set([domain.length], off)

  const b0 = sha256(in0)
  const len1 = 32 + 1 + domain.length + 1
  const in1 = new Uint8Array(len1)
  // b0
  in1.set(getBytes(b0), 0)
  off = 32
  // I2OSP(1, 1)
  in1.set([1], off)
  off += 1
  // DST_prime
  in1.set(domain, off)
  off += domain.length
  in1.set([domain.length], off)

  const b1 = sha256(in1)
  const ell = Math.floor((outLen + 32 - 1) / 32)
  let bi = b1
  for (let i = 1; i < ell; i++) {
    const ini = new Uint8Array(32 + 1 + domain.length + 1)
    const nb0 = zeroPadValue(getBytes(b0), 32)
    const nbi = zeroPadValue(getBytes(bi), 32)
    const tmp = new Uint8Array(32)
    for (let i = 0; i < 32; i++) {
      tmp[i] = nb0[i] ^ nbi[i]
    }
    ini.set(tmp, 0)
    let off = 32
    ini.set([1 + i], off)
    off += 1
    ini.set(domain, off)
    off += domain.length
    ini.set([domain.length], off)

    out.set(getBytes(bi), 32 * (i - 1))
    bi = sha256(ini)
  }
  out.set(getBytes(bi), 32 * (ell - 1))
  return out
}

const DOMAIN = Uint8Array.from(Buffer.from('BNS_SIG_BNS256_XMD:SHA-256_SSWU', 'utf8'))

export function hashToPoint(msg) {
  const _msg = Uint8Array.from(Buffer.from(stringToHex(msg).slice(2), 'hex'))
  const hashRes = hashToField(DOMAIN, _msg, 2)
  const p0 = mapToPoint(hashRes[0].toHexString())
  const p1 = mapToPoint(hashRes[1].toHexString())
  const result = mcl.add(p0, p1)
  result.normalize()
  return result
}

function mapToPoint(eHex) {
  const e1 = new mcl.Fp()
  e1.setStr(BigNumber.from(eHex).mod(FIELD_ORDER).toString())
  return e1.mapToG1()
}

function Fp2ToHex(fp2, prefix = true) {
  const arr = fp2.serialize()
  let s = ''
  for (let i = arr.length - 1; i >= 0; i--) {
    s += ('0' + arr[i].toString(16)).slice(-2)
  }
  return prefix ? '0x' + s : s
}

function G2() {
  const result = new mcl.G2()
  result.setStr('1 0x1800deef121f1e76426a00665e5c4479674322d4f75edadd46debd5cd992f6ed 0x198e9393920d483a7260bfb731fb5d25f1aa493335a9e71297e485b7aef312c2 0x12c85ea5db8c6deb4aab71808dcb408fe3d1e7690c43d37b4ce6cc0166fa7daa 0x090689d0585ff075ec9e99ad690c3395bc4b313370b38ef355acdadcd122975b')
  return result
}

export function getPublicKey(secret) {
  const result = mcl.mul(G2(), deserializeHexStrToSecretKey(secret))
  result.normalize()
  return result
}

export function G1ToNumbers(p) {
  p.normalize()
  return [
    p.getX(),
    p.getY(),
  ].map(_ => BigInt(Fp2ToHex(_).toString()))
}

export function G2ToNumbers(p) {
  const x = Fp2ToHex(p.getX(), false)
  const y = Fp2ToHex(p.getY(), false)
  return [
    x.slice(64),
    x.slice(0, 64),
    y.slice(64),
    y.slice(0, 64),
  ].map(_ => BigInt('0x' + _).toString())
}

export function newKeyPair() {
  const secret = randFr()
  const pubkey = mcl.mul(G2(), secret)
  pubkey.normalize()
  return {pubkey, secret}
}

export function sign(message, secret) {
  const M = hashToPoint(message)
  const signature = mcl.mul(M, secret)
  signature.normalize()
  return {signature, M}
}

function randFr() {
  const randomHex = toBeHex(randomBytes(12))
  const result = new mcl.Fr()
  result.setHashOf(randomHex)
  return result
}

/*------------------------------- MCL extensions -------------------------------*/

export const SecretKey = mcl.Fr
mcl.Fr.prototype.getPublicKey = function () {
  return getPublicKey(this.serializeToHexStr())
}

mcl.Fr.prototype.share = function (vec, id) {
  this.setStr(mcl.shareFr(vec, id).getStr())
  return this
}

mcl.Fr.prototype.add = function (sk) {
  this.setStr(mcl.add(sk, this).getStr())
  return this
}

mcl.Fr.prototype.sign = function (msg) {
  return sign(msg, this).signature
}

export const PublicKey = mcl.G2
mcl.G2.prototype.share = function (vec, id) {
  this.setStr(mcl.shareG2(vec, id).getStr())
  return this
}

mcl.G2.prototype.add = function (pk) {
  this.setStr(mcl.add(pk, this).getStr())
  return this
}

// fast and copy from mcl-wasm c++ code
mcl.G2.prototype.verify = function (signature, msg) {
  // let H = mcl.hashAndMapToG1(msg)  // does not have domain, so does not work. to be worked later
  let H = hashToPoint(msg) // has domain
  H = mcl.neg(H)
  let e1 = mcl.precomputedMillerLoop(signature, new mcl.PrecomputedG2(G2()))
  const e2 = mcl.millerLoop(H, this)
  e1 = mcl.mul(e1, e2)
  e1 = mcl.finalExp(e1)
  return e1.isOne()
}

// slow but clean
mcl.G2.prototype.verify_slow = function (signature, msg) {
  const M = hashToPoint(msg)
  const preComputedG2 = mcl.neg(G2())
  const messageToPublicKeyPairing = mcl.pairing(M, this)
  const messageToPrecomputedG2Pairing = mcl.pairing(signature, preComputedG2)
  return mcl.mul(messageToPublicKeyPairing, messageToPrecomputedG2Pairing).isOne()
}

export const Signature = mcl.G1
mcl.G1.prototype.recover = function (signs, signers) {
  this.setStr(mcl.recoverG1(signers, signs).getStr())
  return this
}
