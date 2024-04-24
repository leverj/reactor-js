import mcl from 'mcl-wasm'
import * as mclWrap from './mcl.js'

export const init = async () => {
  await mclWrap.init()
  mclWrap.setMappingMode(mclWrap.MAPPING_MODE_TI)
  mclWrap.setDomain('testing evmbls')
}

export const deserializeHexStrToSecretKey = (hex) =>   mcl.deserializeHexStrToFr(hex)
export const deserializeHexStrToPublicKey = (hex) =>   mcl.deserializeHexStrToG2(hex)
export const deserializeHexStrToSignature = (hex) =>   mcl.deserializeHexStrToG1(hex)


export const SecretKey = mcl.Fr
mcl.Fr.prototype.getPublicKey = function () {
  return mclWrap.getPublicKey(this.serializeToHexStr())
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
  return mclWrap.sign(mclWrap.stringToHex(msg), this).signature
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
mcl.G2.prototype.verify = function (signature, msg) {
  //fixme: not implemented
  return mcl.verifyG2(signature, mclWrap.stringToHex(msg), this)
}

export const Signature = mcl.G1
mcl.G1.prototype.recover = function (signs, signers) {
  let groupSignature = mcl.recoverG1(signers, signs)
  this.setStr(groupSignature.getStr())
}

