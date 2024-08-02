import {BlsVerifier} from '@leverj/reactor.chain/test'
import {G1ToNumbers, G2ToNumbers, hashToPoint, newKeyPair, sign, stringToHex} from '@leverj/reactor.mcl'
import {expect} from 'expect'

describe('BlsVerifier', () => {
  const message = 'hello world'
  let contract

  before(async () => contract = await BlsVerifier())

  it('verify', async () => {
    const {pubkey, secret} = newKeyPair()
    const {signature, M} = sign(stringToHex(message), secret)
    const res = await contract.verify(G1ToNumbers(signature), G2ToNumbers(pubkey), G1ToNumbers(M))
    expect(res).toEqual(true)
  })

  it('hashToPoint', async () => {
    const res = await contract.hashToPoint(stringToHex(message))
    const fromJs = G1ToNumbers(hashToPoint(message))
    expect(res.map(_ => _.toString())).toEqual(fromJs)
  })
})
