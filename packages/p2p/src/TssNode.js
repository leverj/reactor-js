import {affirm} from '@leverj/lever.common'
import {
  deserializeHexStrToPublicKey,
  deserializeHexStrToSecretKey,
  deserializeHexStrToSignature,
  PublicKey,
  SecretKey,
  Signature,
} from '@leverj/reactor.mcl'
import {DKG_DONE, events, NODE_STATE_CHANGED} from './events.js'

/**
 * Adds secret key contribution together to produce a single secret key
 * @param {Array<Number>} secretKeyShares - an array of pointer to secret keys to add
 * @returns {Number} a pointer to the resulting secret key
 */
const addContributionShares = (secretKeyShares) => {
  const result = secretKeyShares.pop()
  secretKeyShares.forEach(_ => {
    result.add(_)
    _.clear()
  })
  return result
}

/**
 * Verifies a contribution share
 * @param {Number} id - a pointer to the id of the member verifying the contribution
 * @param {Number} contribution - a pointer to the secret key contribution
 * @param {Array<Number>} vvec - an array of pointers to public keys which is
 * the verification vector of the sender of the contribution
 * @returns {Boolean}
 */
const verifyContributionShare = (id, contribution, vvec) => {
  const pk1 = new PublicKey().share(vvec, id)
  const pk2 = contribution.getPublicKey()
  const result = pk1.isEqual(pk2)
  pk1.clear() //fixme: why clear?
  pk2.clear() //fixme: why clear?
  return result
}

/**
 * Adds an array of verification vectors together to produce the groups verification vector
 * @param {Array<Array<Number>>} vvecs - an array containing all the groups verification vectors
 */
const addVerificationVectors = (vvecs) => {
  const results = []
  vvecs.forEach(vvec => {
    vvec.forEach((pk2, i) => {
      const pk1 = results[i]
      if (!pk1) results[i] = pk2
      else {
        pk1.add(pk2)
        pk2.clear()
      }
    })
  })
  return results
}

function getMemberContributions(receivedShares, vvecs) {
  const ids = Object.keys(receivedShares).sort()
  return {
    receivedShares: ids.map(id => receivedShares[id]),
    vvecs: ids.map(id => vvecs[id]),
  }
}

/*** Threshold Signature Scheme ***/
export class TssNode {
  constructor(id, json) {
    affirm(typeof id === 'string', 'id must be a string')
    this.id = new SecretKey().setHashOfString(id)
    this.members = {}
    this.reset()
    this.deserializeShares(json)
  }

  get threshold() { return this.vvec?.length }
  get groupPublicKey() { return this.vvec ? this.vvec[0] : undefined }
  get idHex() { return this.id.serializeToHexStr() }

  reset() {
    this.secretVector = []
    this.verificationVector = []
    this.receivedShares = {}
    this.vvecs = {}
    this.secretKeyShare = undefined
    this.vvec = undefined
    this.previouslyShared = false
  }

  deserializeShares(json) {
    if (!json) return
    const {secretKeyShare, vvec, verificationVector} = json
    this.secretKeyShare = SecretKey.from(secretKeyShare)
    this.vvec = vvec.map(_ => deserializeHexStrToPublicKey(_))
    this.verificationVector = verificationVector.map(_ => PublicKey.from(_))
    this.previouslyShared = true
  }

  reinitiate() {
    this.secretVector = []
    this.verificationVector = []
    this.receivedShares = {}
    this.vvecs = {}
  }

  addMember(memberId, dkgHandler) { this.members[memberId] = dkgHandler }

  onDkgStart(message) {
    const {threshold} = message
    this.generateVectorsAndContribution(threshold)
  }

  onDkgShare(message) {
    const {id, secretKeyContribution, verificationVector} = JSON.parse(message)
    this.verifyAndAddShare(id, SecretKey.from(secretKeyContribution), verificationVector.map(_ => PublicKey.from(_)))
    this.vvecs[id] = verificationVector.map(_ => PublicKey.from(_))
    if (Object.keys(this.vvecs).length === Object.keys(this.members).length) this.dkgDone()
  }

  generateVectorsAndContribution(threshold) {
    this.generateVectors(threshold)
    this.generateContribution()
  }

  generateVectors(threshold) {
    for (let i = 0; i < threshold; i++) {
      const secretKey = new SecretKey()
      this.previouslyShared && i === 0 ? secretKey.deserialize(Buffer.alloc(32)) : secretKey.setByCSPRNG()
      this.secretVector.push(secretKey)
      this.verificationVector.push(secretKey.getPublicKey())
    }
  }

  generateContribution() {
    for (let [id, dkgHandler] of Object.entries(this.members)) this.generateContributionForId(id, dkgHandler)
  }

  verifyAndAddShare(id, receivedShare, verificationVector) {
    if (!verifyContributionShare(this.id, receivedShare, verificationVector)) throw Error('invalid share!')
    this.receivedShares[id] = receivedShare
  }

  generateContributionForId(id, dkgHandler) {
    const contribution = new SecretKey().share(this.secretVector, SecretKey.from(id))
    const payload = {
      id: this.idHex,
      secretKeyContribution: contribution.serializeToHexStr(),
      verificationVector: this.verificationVector.map(_ => _.serializeToHexStr()),
    }
    dkgHandler(JSON.stringify(payload))
  }

  dkgDone() {
    const {receivedShares, vvecs} = getMemberContributions(this.receivedShares, this.vvecs)
    this.secretKeyShare = addContributionShares(this.previouslyShared ? [this.secretKeyShare, ...receivedShares] : receivedShares)
    this.vvec = addVerificationVectors(this.previouslyShared ? [this.vvec, ...vvecs] : vvecs)
    this.previouslyShared = true
    events.emit(DKG_DONE)
    events.emit(NODE_STATE_CHANGED)
  }

  sign(message) { return this.secretKeyShare.sign(message) }

  groupSign(signatures) {
    return new Signature().recover(
      signatures.map(_ => deserializeHexStrToSignature(_.signature)),
      signatures.map(_ => deserializeHexStrToSecretKey(_.signer))
    ).serializeToHexStr()
  }

  verify(signature, message) {
    return this.groupPublicKey.verify(deserializeHexStrToSignature(signature), message)
  }

  state() {
    if (!this.previouslyShared) return
    return {
      id: this.idHex,
      secretKeyShare: this.secretKeyShare?.serializeToHexStr(),
      groupPublicKey: this.groupPublicKey?.serializeToHexStr(),
      verificationVector: this.verificationVector?.map(_ => _.serializeToHexStr()),
      vvec: this.vvec?.map(_ => _.serializeToHexStr()),
    }
  }
}
