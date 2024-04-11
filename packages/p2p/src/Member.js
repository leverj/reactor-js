import bls from 'bls-wasm'
import {addContributionShares, verifyContributionShare, addVerificationVectors, generateContribution, generateZeroContribution} from 'dkg'

export class Member {
  constructor(id) {
    this.id = new bls.SecretKey()
    this.id.setHashOf(Buffer.from([id]))
    this.recievedShares = []
    this.Vvecs = []
  }

  reinitiate() {
    this.recievedShares = [this.secretKeyShare]
    this.Vvecs = [this.Vvec]
  }

  verifyAndAndAddShare(sk, verificationVector) {
    const verified = verifyContributionShare(bls, this.id, sk, verificationVector)
    if (!verified) {
      throw new Error('invalid share!')
    }
    this.recievedShares.push(sk)
  }

  dkgDone() {
    this.secretKeyShare = addContributionShares(this.recievedShares)
    this.Vvec = addVerificationVectors(this.Vvecs)
    this.previouslyShared = true
  }

  addVvecs(vvecs) {
    let stringified = vvecs.map(_ => _.serializeToHexStr())
    let objectified = stringified.map(_ => {
      let publicKey = new bls.PublicKey()
      publicKey.deserializeHexStr(_)
      return publicKey
    })
    this.Vvecs.push(objectified)
  }

  get groupPublicKey() {
    return this.Vvec[0]
  }

  generateContribution(bls, memberIds, threshold) {
    return this.previouslyShared ? generateZeroContribution(bls, memberIds, threshold) : generateContribution(bls, memberIds, threshold)
  }

  sign(message) {
    return this.secretKeyShare.sign(message)
  }


  print() {
    console.log('Member \n', [this.id, this.secretKeyShare, this.groupPublicKey].map(_ => _.serializeToHexStr()).join('\n\t'))
  }
}
