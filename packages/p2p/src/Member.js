import bls from 'bls-wasm'
import {addContributionShares, addVerificationVectors, generateContributionForId, verifyContributionShare} from './dkg-bls.js'

function randomizeArrayCopy(array) {
  const copy = array.slice()
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = copy[i]
    copy[i] = copy[j]
    copy[j] = temp
  }
  return copy
}

function getMemberContributions(recievedShares, vvecs) {
  const ids = randomizeArrayCopy(Object.keys(recievedShares))
  // const ids = Object.keys(recievedShares).sort()
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

export class Member {
  static TOPICS = {
    DKG_KEY_GENERATE: 'DKG_KEY_GENERATE',
  }

  constructor(id) {
    this.id = new bls.SecretKey()
    this.id.setHashOf(Buffer.from([id]))
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


  addMember(memberId, onMessage) { this.members[memberId] = onMessage }

  onMessage(topic, message) {
    switch (topic) {
      case Member.TOPICS.DKG_KEY_GENERATE:
        const {id, secretKeyContribution, verificationVector} = JSON.parse(message)
        this.verifyAndAddShare(id, toPrivateKey(secretKeyContribution), verificationVector.map(toPublicKey))
        this.vvecs[id] = verificationVector.map(toPublicKey)
        break
      default:
        console.log('unknown topic', topic)
    }
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

  generateContribution() {
    for (const [id, onMessage] of Object.entries(this.members))
      this.generateContributionForId(id, onMessage)
  }


  verifyAndAddShare(id, receivedShare, verificationVector) {
    const verified = verifyContributionShare(bls, this.id, receivedShare, verificationVector)
    if (!verified) {
      throw new Error('invalid share!')
    }
    this.recievedShares[id] = receivedShare
  }

  generateContributionForId(id, onMessage) {
    let secretKeyContribution = generateContributionForId(bls, toPrivateKey(id), this.secretVector)
    onMessage(Member.TOPICS.DKG_KEY_GENERATE, JSON.stringify({
      id: this.id.serializeToHexStr(),
      secretKeyContribution: secretKeyContribution.serializeToHexStr(),
      verificationVector: this.verificationVector.map(_ => _.serializeToHexStr())
    }))
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
    return this.vvec[0]
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
    console.log([this.id, this.secretKeyShare, this.groupPublicKey].map(_ => _.serializeToHexStr()).join('\n\t'))
  }
}
