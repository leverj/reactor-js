import {BnsVerifier, publicKey, signedBy, signer} from '@leverj/reactor.chain/test'
import {newKeyPair} from '@leverj/reactor.mcl'
import {AbiCoder, keccak256} from 'ethers'
import {expect} from 'expect'

describe('BnsVerifier', () => {
  const message = keccak256(AbiCoder.defaultAbiCoder().encode(['string'], ['hello world']))
  let verifier

  before(async () => verifier = await BnsVerifier())

  it('can verify', async () => {
    await expect(() => verifier.verify(signedBy(message, signer), publicKey, message)).not.toThrow()

    const impersonator = newKeyPair()
    await expect(() => verifier.verify(signedBy(message, impersonator), publicKey, message)).rejects.toThrow(/'Invalid Signature/)
  })
})
