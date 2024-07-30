export const generateContributionForId = function (bls, id, svec) {
  const sk = new bls.SecretKey()
  sk.share(svec, id)
  return sk
}

/**
 * Adds secret key contribution together to produce a single secret key
 * @param {Array<Number>} secretKeyShares - an array of pointer to secret keys to add
 * @returns {Number} a pointer to the resulting secret key
 */
export const addContributionShares = function (secretKeyShares) {
  const first = secretKeyShares.pop()
  secretKeyShares.forEach(sk => {
    first.add(sk)
    sk.clear()
  })
  return first
}

/**
 * Verifies a contribution share
 * @param {Object} bls - an instance of [bls-wasm](https://github.com/herumi/bls-wasm)
 * @param {Number} id - a pointer to the id of the member verifiing the contribution
 * @param {Number} contribution - a pointer to the secret key contribution
 * @param {Array<Number>} vvec - an array of pointers to public keys which is
 * the verification vector of the sender of the contribution
 * @returns {Boolean}
 */
export const verifyContributionShare = function (bls, id, contribution, vvec) {
  const pk1 = new bls.PublicKey()
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
export const addVerificationVectors = function (vvecs) {
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
