import {expect} from 'expect'
import bls from 'bls-wasm'
import {addContributionShares, addVerificationVectors, generateContribution,generateZeroContribution, verifyContributionShare} from 'dkg'

describe('dkg', function () {

  it('should be able to create distributed keys', async function () {
    await bls.init()
    const threshold = 4
    // each member in the group needs a unique ID. What the id is doesn't matter
    // but it does need to be imported into bls-lib as a secret key
    const members = [10314, 30911, 25411, 8608, 31524, 15441, 23399].map(id => {
      const sk = new bls.SecretKey()
      sk.setHashOf(Buffer.from([id]))
      return {
        id: sk,
        recievedShares: []
      }
    })

    console.log('Beginning the secret instantiation round...', members)

    // this stores an array of verifcation vectors. One for each Member
    const vvecs = []

    // each member need to first create a verification vector and a secret key
    // contribution for every other member in the group (including itself!)
    members.forEach(id => {
      const {verificationVector, secretKeyContribution} = generateContribution(bls, members.map(m => m.id), threshold)
      // the verification vector should be posted publically so that everyone
      // in the group can see it
      vvecs.push(verificationVector)

      // Each secret sk contribution is then encrypted and sent to the member it is for.
      secretKeyContribution.forEach((sk, i) => {
        // when a group member receives its share, it verifies it against the
        // verification vector of the sender and then saves it
        const member = members[i]
        const verified = verifyContributionShare(bls, member.id, sk, verificationVector)
        if (!verified) {
          throw new Error('invalid share!')
        }
        member.recievedShares.push(sk)
      })
    })

    // now each members adds together all received secret key contributions shares to get a
    // single secretkey share for the group used for signing message for the group
    members.forEach((member, i) => {
      const sk = addContributionShares(member.recievedShares)
      member.secretKeyShare = sk
    })
    console.log('-> secret shares have been generated')

    // Now any one can add together the all verification vectors posted by the
    // members of the group to get a single verification vector of for the group
    const groupsVvec = addVerificationVectors(vvecs)
    console.log('-> verification vector computed')

    // the groups verifcation vector contains the groups public key. The group's
    // public key is the first element in the array
    const groupsPublicKey = groupsVvec[0]

    console.log('-> group public key : ', groupsPublicKey.serializeToHexStr())

    console.log('-> testing signature')
    // now we can select any 4 members to sign on a message
    const message = 'hello world'
    const sigs = []
    const signersIds = []
    for (let i = 0; i < threshold; i++) {
      const sig = members[i].secretKeyShare.sign(message)
      sigs.push(sig)
      signersIds.push(members[i].id)
    }

    // then anyone can combine the signatures to get the groups signature
    // the resulting signature will also be the same no matter which members signed
    const groupsSig = new bls.Signature()
    groupsSig.recover(sigs, signersIds)

    console.log('->    sigtest result : ', groupsSig.serializeToHexStr())

    var verified = groupsPublicKey.verify(groupsSig, message)
    console.log('->    verified ?', Boolean(verified))
    groupsSig.clear()

    console.log('-> testing individual public key derivation')
    // we can also use the groups verification vector to derive any of the members
    // public key
    const member = members[4]
    const pk1 = new bls.PublicKey()
    pk1.share(groupsVvec, member.id)

    const pk2 = member.secretKeyShare.getPublicKey()
    console.log('->    are the public keys equal?', Boolean(pk1.isEqual(pk2)))

    console.log('\nBeginning the share renewal round...')

    const newVvecs = [groupsVvec]

    console.log('-> member shares array reinitialized')
    members.forEach(member => {
      member.recievedShares.length = 0
      member.recievedShares.push(member.secretKeyShare)
    })

    console.log('-> running null-secret contribution generator')
    // the process is very similar, only `generateZeroContribution` works with a null secret
    members.forEach(id => {
      const {verificationVector, secretKeyContribution} = generateZeroContribution(bls, members.map(m => m.id), threshold)
      // the verification vector should be posted publically so that everyone
      // in the group can see it
      newVvecs.push(verificationVector)

      // Each secret key contribution is then encrypted and sent to the member it is for.
      secretKeyContribution.forEach((sk, i) => {
        // when a group member receives its share, it verifies it against the
        // verification vector of the sender and then saves it
        const member = members[i]
        const verified = verifyContributionShare(bls, member.id, sk, verificationVector)
        if (!verified) {
          throw new Error('invalid share!')
        }
        member.recievedShares.push(sk)
      })
    })

    // now each members adds together all received secret key contributions shares to get a
    // single secretkey share for the group used for signing message for the group
    members.forEach((member, i) => {
      const sk = addContributionShares(member.recievedShares)
      member.secretKeyShare = sk
    })
    console.log('-> new secret shares have been generated')

    // Now any one can add together the all verification vectors posted by the
    // members of the group to get a single verification vector of for the group
    const newGroupsVvec = addVerificationVectors(newVvecs)
    console.log('-> verification vector computed')

    // the groups verifcation vector contains the groups public key. The group's
    // public key is the first element in the array
    const newGroupsPublicKey = newGroupsVvec[0]

    verified = newGroupsPublicKey.isEqual(groupsPublicKey)
    console.log('-> public key should not have changed :', (verified ? 'success' : 'failure'))

    console.log('-> testing signature using new shares')
    // now we can select any 4 members to sign on a message
    sigs.length = 0
    signersIds.length = 0
    for (let i = 0; i < threshold; i++) {
      const sig = members[i].secretKeyShare.sign(message)
      sigs.push(sig)
      signersIds.push(members[i].id)
    }

    // then anyone can combine the signatures to get the groups signature
    // the resulting signature will also be the same no matter which members signed
    const groupsNewSig = new bls.Signature()
    groupsNewSig.recover(sigs, signersIds)

    console.log('->    sigtest result : ', groupsNewSig.serializeToHexStr())
    console.log('->    signature comparison :', (groupsSig.isEqual(groupsNewSig) ? 'success' : 'failure'))

    verified = groupsPublicKey.verify(groupsNewSig, message)
    console.log('->    verified ?', Boolean(verified))
    groupsNewSig.clear()

    // don't forget to clean up!
    pk1.clear()
    pk2.clear()
    groupsVvec.forEach(v => v.clear())
    newGroupsVvec.forEach(v => v.clear())
    members.forEach(m => {
      m.secretKeyShare.clear()
      m.id.clear()
    })

  })
})