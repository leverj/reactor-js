import {affirm, logger} from '@leverj/common/utils'
import {
  deserializeHexStrToPublicKey,
  deserializeHexStrToSecretKey,
  deserializeHexStrToSignature,
  PublicKey,
  SecretKey,
  Signature,
} from '@leverj/reactor.mcl'
import {events, INFO_CHANGED} from './utils/index.js'

/**
 * Adds secret key contribution together to produce a single secret key
 * @param {Array<Number>} secretKeyShares - an array of pointer to secret keys to add
 * @returns {Number} a pointer to the resulting secret key
 */
const addContributionShares = (secretKeyShares) => {
  const result = secretKeyShares.pop()
  secretKeyShares.forEach(sk => {
    result.add(sk)
    sk.clear()
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
  pk1.clear()
  pk2.clear()
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
  get groupPublicKey() { return this.vvec ? this.vvec[0] : null }
  get publicKey() { return new PublicKey().share(this.vvec, this.id) }
  get idHex() { return this.id.serializeToHexStr() }

  reset() {
    this.secretVector = []
    this.verificationVector = []
    this.receivedShares = {}
    this.vvecs = {}
    this.secretKeyShare = null
    this.vvec = null
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

  onDkgShare(dkgShareMessage) {
    const {id, secretKeyContribution, verificationVector} = JSON.parse(dkgShareMessage)
    this.verifyAndAddShare(id, SecretKey.from(secretKeyContribution), verificationVector.map(_ => PublicKey.from(_)))
    this.vvecs[id] = verificationVector.map(_ => PublicKey.from(_))
    if (Object.keys(this.vvecs).length === Object.keys(this.members).length) this.dkgDone()
  }

  async generateVectorsAndContribution(threshold) {
    this.generateVectors(threshold)
    return this.generateContribution()
  }

  generateVectors(threshold) {
    for (let i = 0; i < threshold; i++) {
      const sk = new SecretKey()
      this.previouslyShared && i === 0 ? sk.deserialize(Buffer.alloc(32)) : sk.setByCSPRNG()
      this.secretVector.push(sk)
      this.verificationVector.push(sk.getPublicKey())
    }
  }

  async generateContribution() {
    for (let [id, dkgHandler] of Object.entries(this.members)) await this.generateContributionForId(id, dkgHandler)
  }

  verifyAndAddShare(id, receivedShare, verificationVector) {
    const verified = verifyContributionShare(this.id, receivedShare, verificationVector)
    if (!verified) throw Error('invalid share!')
    this.receivedShares[id] = receivedShare
  }

  async generateContributionForId(id, dkgHandler) {
    const result = new SecretKey().share(this.secretVector, SecretKey.from(id))
    const dkgSharePayload = {
      id: this.idHex,
      secretKeyContribution: result.serializeToHexStr(),
      verificationVector: this.verificationVector.map(_ => _.serializeToHexStr()),
    }
    await dkgHandler(JSON.stringify(dkgSharePayload))
    return result
  }

  dkgDone() {
    const {receivedShares, vvecs} = getMemberContributions(this.receivedShares, this.vvecs)
    this.secretKeyShare = addContributionShares(this.previouslyShared ? [this.secretKeyShare, ...receivedShares] : receivedShares)
    this.vvec = addVerificationVectors(this.previouslyShared ? [this.vvec, ...vvecs] : vvecs)
    this.previouslyShared = true
    events.emit(INFO_CHANGED)
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

  print() {
    logger.log([this.id, this.secretKeyShare, this.groupPublicKey].map(_ => _?.serializeToHexStr()).join('\n\t'))
  }

  exportJson() {
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
