import bls from '@chainsafe/bls'
import {expect} from 'expect'
import {toHexString} from '@chainsafe/ssz'
import {fromString as uint8ArrayFromString} from 'uint8arrays/from-string'


describe('bls', function () {
  afterEach(function () { })
  it('generate public keys with multiple apis', async function () {
    const secretKey = bls.SecretKey.fromKeygen()
    const publicKey1 = secretKey.toPublicKey()
    const publicKey2 = bls.secretKeyToPublicKey(secretKey.toBytes())
    expect(publicKey1.toHex()).toEqual(toHexString(publicKey2))
  })
  //use bls.aggregate api
  it('verifies aggregate signatures, technique 1', async function () {
    const sks = Array.from({length: 4}, () => bls.SecretKey.fromKeygen())
    const message = uint8ArrayFromString('Hello Gluon 2')
    const pks = sks.map(sk => sk.toPublicKey())
    const sigs = sks.map(sk => sk.sign(message))
    const aggSig = bls.aggregateSignatures(sigs.map((sig) => sig.toBytes()))
    const aggregatePublicKey = bls.aggregatePublicKeys(pks.map((pk) => pk.toBytes()))
    const aggregatePublicKey2 = bls.PublicKey.aggregate(pks)
    expect(toHexString(aggregatePublicKey)).toEqual(aggregatePublicKey2.toHex())
    expect(bls.verify(aggregatePublicKey, message, aggSig)).toEqual(true)
    expect(bls.verify(aggregatePublicKey2.toBytes(), message, aggSig)).toEqual(true)
  })
})
