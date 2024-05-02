import bls from './bls.js'
import {affirm} from '@leverj/common/utils'
import {addContributionShares, addVerificationVectors, generateContributionForId, verifyContributionShare} from './dkg-bls.js'


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

/* Threshold Signature Scheme */
export class TSSNode {

  constructor(id) {
    affirm(typeof id === 'string', 'id must be a string')
    this.id = new bls.SecretKey()
    this.id.setHashOf(Buffer.from(id))
    this.members = {}
    this.reset()
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
    // console.log(this.id.serializeToHexStr(), Object.keys(this.vvecs).length)
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
    // console.log('generated vectors', threshold, this.peerId)
  }

  async generateContribution() {
    for (const [id, dkgHandler] of Object.entries(this.members))
      await this.generateContributionForId(id, dkgHandler)
    // console.log('generated contribution', this.peerId)
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

  dkgDone() {
    //fixme: randomize is failing test.
    const {recievedShares, vvecs} = getMemberContributions(this.recievedShares, this.vvecs)
    this.secretKeyShare = addContributionShares(this.previouslyShared ? [this.secretKeyShare, ...recievedShares] : recievedShares)
    this.vvec = addVerificationVectors(this.previouslyShared ? [this.vvec, ...vvecs] : vvecs)
    this.previouslyShared = true
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
