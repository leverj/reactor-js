import {BlsVerify} from '@leverj/reactor.chain/test'
import {g1ToBN, g2ToBN, hashToPoint, newKeyPair, sign, stringToHex} from '@leverj/reactor.mcl'
import {expect} from 'expect'

describe('BlsVerify', () => {
  const message = 'hello world'
  let contract

  before(async () => contract = await BlsVerify())

  it('verifySignature', async () => {
    const {pubkey, secret} = newKeyPair()
    const {signature, M} = sign(stringToHex(message), secret)
    const res = await contract.verifySignature(g1ToBN(signature), g2ToBN(pubkey), g1ToBN(M))
    expect(res).toEqual(true)
  })

  it('hashToPoint', async () => {
    const res = await contract.hashToPoint(stringToHex(message))
    const fromJs = g1ToBN(hashToPoint(message))
    expect(res.map(_ => _.toString())).toEqual(fromJs)
  })
})
