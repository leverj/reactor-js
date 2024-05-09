import bls from './bls.js'
import {affirm} from '@leverj/common/utils'
import {addContributionShares, addVerificationVectors, generateContributionForId, verifyContributionShare} from './dkg-bls.js'
import path from 'path'
import config from 'config'
import {writeFileSync, readFileSync, existsSync} from 'fs'
import * as mcl from '../src/mcl/mcl.js'

function getMemberContributions(recievedShares, vvecs) {
  const ids = Object.keys(recievedShares).sort()
  const sortedShares = ids.map(id => recievedShares[id])
  const sortedVvecs = ids.map(id => vvecs[id])
  return {recievedShares: sortedShares, vvecs: sortedVvecs}
}

function toPrivateKey(str) {
  let secretKey = new bls.SecretKey()
  secretKey.deserializeHexStr(str)
  return secretKey
}

function toPublicKey(str) {
  let publicKey = new bls.PublicKey()
  publicKey.deserializeHexStr(str)
  return publicKey
}

export function generateDkgId(id) {
  const dkgId = new bls.SecretKey()
  dkgId.setHashOf(Buffer.from(id))
  return dkgId.serializeToHexStr()
}

/* Threshold Signature Scheme */
export class TSSNode {

  constructor(id) {
    affirm(typeof id === 'string', 'id must be a string')
    this.id = new bls.SecretKey()
    this.id.setHashOf(Buffer.from(id))
    this.members = {}
    this.reset()
    this.deserializeShares()
  }

  reset() {
    this.secretVector = []
    this.verificationVector = []
    this.recievedShares = {}
    this.vvecs = {}
    this.secretKeyShare = null
    this.vvec = null
    this.previouslyShared = false
  }
  async serializeShares(){
    const file = path.join(config.bridgeNode.confDir, 'share.json')
    const arr = []
    for (const v of this.vvec){
      arr.push(v.serializeToHexStr())
    }
    writeFileSync(file, JSON.stringify({'vvec': arr,'secretShare': this.secretKeyShare.serializeToHexStr()}), null, 2, 'utf8')
  }
  async deserializeShares(){
    try{
      const file = path.join(config.bridgeNode.confDir, 'share.json')
      if(!existsSync(file)) return
      const fileContent =  readFileSync(file, 'utf8')
      const {secretShare, vvec} = JSON.parse(fileContent)
      let secretKey = new bls.SecretKey()
      secretKey.deserializeHexStr(secretShare)
      this.secretKeyShare = secretKey
      this.vvec = []
      for (const vv of vvec){
        this.vvec.push(mcl.deserializeHexStrToPublicKey(vv))
      }
      this.previouslyShared = true
    }catch(e){console.log(e)}
  }

  reinitiate() {
    this.secretVector = []
    this.verificationVector = []
    this.recievedShares = {}
    this.vvecs = {}
  }


  addMember(memberId, dkgHandler) {
    this.members[memberId] = dkgHandler
  }

  onDkgShare(dkgShareMessage) {
    const {id, secretKeyContribution, verificationVector} = JSON.parse(dkgShareMessage)
    this.verifyAndAddShare(id, toPrivateKey(secretKeyContribution), verificationVector.map(toPublicKey))
    this.vvecs[id] = verificationVector.map(toPublicKey)
    if (Object.keys(this.vvecs).length === Object.keys(this.members).length) this.dkgDone()
  }

  generateVectors(threshold) {
    for (let i = 0; i < threshold; i++) {
      let sk = new bls.SecretKey()
      this.previouslyShared && i === 0 ? sk.deserialize(Buffer.alloc(32)) : sk.setByCSPRNG()
      this.secretVector.push(sk)
      const pk = sk.getPublicKey()
      this.verificationVector.push(pk)
    }
  }

  async generateContribution() {
    for (const [id, dkgHandler] of Object.entries(this.members))
      await this.generateContributionForId(id, dkgHandler)
  }


  verifyAndAddShare(id, receivedShare, verificationVector) {
    const verified = verifyContributionShare(bls, this.id, receivedShare, verificationVector)
    if (!verified) {
      throw new Error('invalid share!')
    }
    this.recievedShares[id] = receivedShare
  }

  async generateContributionForId(id, dkgHandler) {
    let secretKeyContribution = await generateContributionForId(bls, toPrivateKey(id), this.secretVector)
    let dkgSharePayload = {
      id: this.id.serializeToHexStr(),
      secretKeyContribution: secretKeyContribution.serializeToHexStr(),
      verificationVector: this.verificationVector.map(_ => _.serializeToHexStr())
    }
    await dkgHandler(JSON.stringify(dkgSharePayload))
    return secretKeyContribution
  }

  async dkgDone() {
    const {recievedShares, vvecs} = getMemberContributions(this.recievedShares, this.vvecs)
    this.secretKeyShare = addContributionShares(this.previouslyShared ? [this.secretKeyShare, ...recievedShares] : recievedShares)
    this.vvec = addVerificationVectors(this.previouslyShared ? [this.vvec, ...vvecs] : vvecs)
    this.previouslyShared = true
    await this.serializeShares()
  }

  get groupPublicKey() {
    return this.vvec ? this.vvec[0] : null
  }

  get publicKey() {
    const pk1 = new bls.PublicKey()
    pk1.share(this.vvec, this.id)
    return pk1
  }

  sign(message) {
    return this.secretKeyShare.sign(message)
  }

  print() {
    console.log([this.id, this.secretKeyShare, this.groupPublicKey].map(_ => _?.serializeToHexStr()).join('\n\t'))
  }

  exportJson() {
    if(!this.previouslyShared) return
    return {
      id: this.id.serializeToHexStr(),
      secretKeyShare: this.secretKeyShare?.serializeToHexStr(),
      groupPublicKey: this.groupPublicKey?.serializeToHexStr(),
      verificationVector: this.verificationVector?.map(_ => _.serializeToHexStr()),
      vvec: this.vvec?.map(_ => _.serializeToHexStr())
    }
  }
}
