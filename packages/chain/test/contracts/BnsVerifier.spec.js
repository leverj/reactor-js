import {G1ToNumbers, G2ToNumbers, newKeyPair, sign} from '@leverj/reactor.mcl'
import {AbiCoder, keccak256} from 'ethers'
import {expect} from 'expect'
import {BnsVerifier} from './help/index.js'

describe('BnsVerifier', () => {
  const message = keccak256(AbiCoder.defaultAbiCoder().encode(['string'], ['hello world']))
  let verifier

  before(async () => verifier = await BnsVerifier())

  it('can verify', async () => {
    const signer = newKeyPair()
    await expect(() => verifier.verify(
      G1ToNumbers(sign(message, signer.secret).signature),
      G2ToNumbers(signer.pubkey),
      message
    )).not.toThrow()

    const impersonator = newKeyPair()
    await expect(() => verifier.verify(
      G1ToNumbers(sign(message, impersonator.secret).signature),
      G2ToNumbers(signer.pubkey),
      message
    )).rejects.toThrow(/'Invalid Signature/)
  })
})
