import {BlsVerifier} from '@leverj/reactor.chain/test'
import {G1ToNumbers, G2ToNumbers, newKeyPair, sign, stringToHex} from '@leverj/reactor.mcl'
import {expect} from 'expect'

describe('BlsVerifier', () => {
  const message = 'hello world'
  let contract

  before(async () => contract = await BlsVerifier())

  it.skip('validate', async () => {
    const {pubkey, secret} = newKeyPair()
    const {signature, M} = sign(stringToHex(message), secret)
    // const hash =  keccak256(payload)
    const hash =  G1ToNumbers(M)
    //fixme: expect to not throw exception
    const res = await contract.validate(G1ToNumbers(signature), G2ToNumbers(pubkey), hash)
  })

  it('verify', async () => {
    const {pubkey, secret} = newKeyPair()
    const {signature, M} = sign(stringToHex(message), secret)
    const res = await contract.verify(G1ToNumbers(signature), G2ToNumbers(pubkey), G1ToNumbers(M))
    expect(res).toEqual(true)
  })
})
