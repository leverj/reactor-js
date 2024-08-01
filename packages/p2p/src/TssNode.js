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

const generateContributionForId = function (id, svec) {
  const sk = new SecretKey()
  sk.share(svec, id)
  return sk
}

/**
 * Adds secret key contribution together to produce a single secret key
 * @param {Array<Number>} secretKeyShares - an array of pointer to secret keys to add
 * @returns {Number} a pointer to the resulting secret key
 */
const addContributionShares = function (secretKeyShares) {
  const first = secretKeyShares.pop()
  secretKeyShares.forEach(sk => {
    first.add(sk)
    sk.clear()
  })
  return first
}

/**
 * Verifies a contribution share
 * @param {Number} id - a pointer to the id of the member verifiing the contribution
 * @param {Number} contribution - a pointer to the secret key contribution
 * @param {Array<Number>} vvec - an array of pointers to public keys which is
 * the verification vector of the sender of the contribution
 * @returns {Boolean}
 */
const verifyContributionShare = function (id, contribution, vvec) {
  const pk1 = new PublicKey()
  pk1.share(vvec, id)
  const pk2 = contribution.getPublicKey()
  const isEqual = pk1.isEqual(pk2)
  pk1.clear()
  pk2.clear()
  return Boolean(isEqual)
}

/**
 * Adds an array of verification vectors together to produce the groups verification vector
 * @param {Array<Array<Number>>} vvecs - an array containing all the groups verifciation vectors
 */
const addVerificationVectors = function (vvecs) {
  const groupsVvec = []
  vvecs.forEach(vvec => {
    vvec.forEach((pk2, i) => {
      const pk1 = groupsVvec[i]
      if (!pk1) {
        groupsVvec[i] = pk2
      } else {
        pk1.add(pk2)
        pk2.clear()
      }
    })
  })
  return groupsVvec
}

function getMemberContributions(recievedShares, vvecs) {
  const ids = Object.keys(recievedShares).sort()
  const sortedShares = ids.map(id => recievedShares[id])
  const sortedVvecs = ids.map(id => vvecs[id])
  return {recievedShares: sortedShares, vvecs: sortedVvecs}
}

function toPrivateKey(str) {
  const secretKey = new SecretKey()
  secretKey.deserializeHexStr(str)
  return secretKey
}

function toPublicKey(str) {
  const publicKey = new PublicKey()
  publicKey.deserializeHexStr(str)
  return publicKey
}

/* Threshold Signature Scheme */
export class TssNode {

  constructor(id, json) {
    affirm(typeof id === 'string', 'id must be a string')
    this.id = new SecretKey()
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
    const secretKey = new SecretKey()
    secretKey.deserializeHexStr(json.secretKeyShare)
    this.secretKeyShare = secretKey
    this.vvec = []
    for (const vv of json.vvec) {
      this.vvec.push(deserializeHexStrToPublicKey(vv))
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
      const sk = new SecretKey()
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
    const verified = verifyContributionShare(this.id, receivedShare, verificationVector)
    if (!verified) {
      throw Error('invalid share!')
    }
    this.recievedShares[id] = receivedShare
  }

  async generateContributionForId(id, dkgHandler) {
    const secretKeyContribution = await generateContributionForId(toPrivateKey(id), this.secretVector)
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
    const pk1 = new PublicKey()
    pk1.share(this.vvec, this.id)
    return pk1
  }

  sign(message) {
    return this.secretKeyShare.sign(message)
  }

  groupSign(signatures) {
    const signers = signatures.map(m => deserializeHexStrToSecretKey(m.signer))
    const signs = signatures.map(m => deserializeHexStrToSignature(m.signature))
    const groupsSign = new Signature()
    groupsSign.recover(signs, signers)
    return groupsSign.serializeToHexStr()
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
      id: this.id.serializeToHexStr(),
      secretKeyShare: this.secretKeyShare?.serializeToHexStr(),
      groupPublicKey: this.groupPublicKey?.serializeToHexStr(),
      verificationVector: this.verificationVector?.map(_ => _.serializeToHexStr()),
      vvec: this.vvec?.map(_ => _.serializeToHexStr()),
    }
  }
}
