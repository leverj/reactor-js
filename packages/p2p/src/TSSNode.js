import {affirm, logger} from '@leverj/common/utils'
import {
  addContributionShares,
  addVerificationVectors,
  bls,
  events,
  generateContributionForId,
  INFO_CHANGED,
  verifyContributionShare,
} from './utils/index.js'

function getMemberContributions(recievedShares, vvecs) {
  const ids = Object.keys(recievedShares).sort()
  const sortedShares = ids.map(id => recievedShares[id])
  const sortedVvecs = ids.map(id => vvecs[id])
  return {recievedShares: sortedShares, vvecs: sortedVvecs}
}

function toPrivateKey(str) {
  const secretKey = new bls.SecretKey()
  secretKey.deserializeHexStr(str)
  return secretKey
}

function toPublicKey(str) {
  const publicKey = new bls.PublicKey()
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

  constructor(id, json) {
    affirm(typeof id === 'string', 'id must be a string')
    this.id = new bls.SecretKey()
    this.id.setHashOf(Buffer.from(id))
    this.members = {}
    this.reset()
    this.deserializeShares(json)
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

  deserializeShares(json) {
    if (!json) return
    const secretKey = new bls.SecretKey()
    secretKey.deserializeHexStr(json.secretKeyShare)
    this.secretKeyShare = secretKey
    this.vvec = []
    for (const vv of json.vvec) {
      this.vvec.push(bls.deserializeHexStrToPublicKey(vv))
    }
    this.verificationVector = json.verificationVector.map(_ => toPublicKey(_))
    this.previouslyShared = true
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
      const sk = new bls.SecretKey()
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
      throw Error('invalid share!')
    }
    this.recievedShares[id] = receivedShare
  }

  async generateContributionForId(id, dkgHandler) {
    const secretKeyContribution = await generateContributionForId(bls, toPrivateKey(id), this.secretVector)
    const dkgSharePayload = {
      id: this.id.serializeToHexStr(),
      secretKeyContribution: secretKeyContribution.serializeToHexStr(),
      verificationVector: this.verificationVector.map(_ => _.serializeToHexStr()),
    }
    await dkgHandler(JSON.stringify(dkgSharePayload))
    return secretKeyContribution
  }

  async dkgDone() {
    const {recievedShares, vvecs} = getMemberContributions(this.recievedShares, this.vvecs)
    this.secretKeyShare = addContributionShares(this.previouslyShared ? [this.secretKeyShare, ...recievedShares] : recievedShares)
    this.vvec = addVerificationVectors(this.previouslyShared ? [this.vvec, ...vvecs] : vvecs)
    this.previouslyShared = true
    events.emit(INFO_CHANGED)
  }

  get threshold() {
    return this.vvec?.length
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

  groupSign(signatures) {
    const signers = signatures.map(m => bls.deserializeHexStrToSecretKey(m.signer))
    const signs = signatures.map(m => bls.deserializeHexStrToSignature(m.signature))
    const groupsSign = new bls.Signature()
    groupsSign.recover(signs, signers)
    return groupsSign.serializeToHexStr()
  }

  verify(signature, message) {
    return this.groupPublicKey.verify(bls.deserializeHexStrToSignature(signature), message)
  }

  print() {
    logger.log([this.id, this.secretKeyShare, this.groupPublicKey].map(_ => _?.serializeToHexStr()).join('\n\t'))
  }

  exportJson() {
    if (!this.previouslyShared) return
    return {
      id: this.id.serializeToHexStr(),
      secretKeyShare: this.secretKeyShare?.serializeToHexStr(),
      groupPublicKey: this.groupPublicKey?.serializeToHexStr(),
      verificationVector: this.verificationVector?.map(_ => _.serializeToHexStr()),
      vvec: this.vvec?.map(_ => _.serializeToHexStr()),
    }
  }
}
