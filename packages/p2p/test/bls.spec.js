import bls from '@chainsafe/bls'
import {expect} from 'expect'
import {fromHexString, toHexString} from '@chainsafe/ssz'
import {fromString as uint8ArrayFromString} from 'uint8arrays/from-string'
import {toString as uint8ArrayToString} from 'uint8arrays/to-string'
import {startNodes} from './help.js'

describe('bls', function () {
  afterEach(function () { })
  it('generate random keys and sign', async function () {
    const secretKey = bls.SecretKey.fromKeygen()
    const publicKey = secretKey.toPublicKey()
    let message = uint8ArrayFromString('Hello Gluon 2')
    const signature = secretKey.sign(message)
    console.log('#'.repeat(50), 'secretKey', secretKey.toHex(), 'publicKey', publicKey.toHex(), 'message', uint8ArrayToString(message), 'signature', signature.toHex())
    expect(signature.verify(publicKey, message)).toEqual(true)

    const sk = secretKey.toBytes()
    const pk = bls.secretKeyToPublicKey(sk)

    const sig = bls.sign(sk, message)
    expect(uint8ArrayToString(publicKey.toBytes())).toEqual(uint8ArrayToString(pk))
    expect(bls.verify(pk, message, sig)).toEqual(true)

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

  it(' aggregate signatures ', async function () {
    let input = 'Hello Gluon 2'

    const secretKey = bls.SecretKey.fromKeygen()
    const publicKey = secretKey.toPublicKey()
    let message = uint8ArrayFromString(input)
    const signature = secretKey.sign(message)
    const pubKeyToHex = (publicKey.toHex())
    const signatureToHex = (signature.toHex())
    const messageToHex = Buffer.from(message).toString('hex')

    const secretKey1 = bls.SecretKey.fromKeygen()
    const publicKey1 = secretKey.toPublicKey()
    let message1 = uint8ArrayFromString(input)
    const signature1 = secretKey.sign(message)
    const pubKeyToHex1 = (publicKey.toHex())
    const signatureToHex1 = (signature.toHex())
    const messageToHex1 = Buffer.from(message).toString('hex')

    //let pubkeys = [pubKeyToHex, pubKeyToHex1]
    let pubkeys = [bls.aggregatePublicKeys([publicKey, publicKey1].map((pk) => pk.toBytes()))]
    const messages = [message, message]
    const sigs = [signature, signature1]
    //function aggregate(input){
    //const pks = input.map((pkHex) => bls.Signature.fromHex(pkHex));
    const aggSig = bls.aggregateSignatures(sigs.map((sig) => sig.toBytes()))
    //}
    //const aggrgateSignature = aggregate([signatureToHex, signatureToHex1])

    const verify = bls.verifyMultiple(pubkeys, messages, aggSig)
    console.log(verify)
    expect(verify).toEqual(true)
  })


  it.skip('generate keys from json and sign', async function () {
    /*const secretKey = bls.SecretKey.fromKeygen();
    const publicKey = secretKey.toPublicKey();

    const toBytes = secretKey.toBytes()
    console.log(toBytes)
    const base64String = uint8ArrayToString(toBytes, 'base64')
    console.log(base64String)*/
    const peerIdJson = {
      privKey: 'CAESQK0/fGhAG26fRXLTxDyV7LpSreIfOXSJ+krI+BdTbeJq5/UphgwH8/mDsTa9HebrBuDJ6EtxNwnEAjEVyA/OQjU',
      pubKey: 'CAESIOf1KYYMB/P5g7E2vR3m6wbgyehLcTcJxAIxFcgPzkI1',
      id: '12D3KooWRRqAo5f41sQmc9BpsfqarZgd7PWUiX14Mz1htXDEc7Gp'
    }
    const [node1] = await startNodes(1)
    console.log(node1.node.peerId.privateKey)
    let pvt_pub = node1.node.peerId.privateKey.slice(4)
    console.log(pvt_pub)
    let pvt = pvt_pub.slice(0, 32)
    let pub = pvt_pub.slice(32)
    console.log('pvt', pvt)
    console.log('pub', pub)
    const privKeyHex = uint8ArrayToString(pvt, 'hex')
    console.log('privKeyHex', privKeyHex)
    const secretKey = bls.SecretKey.fromBytes(pub)
    console.log(secretKey)

  })
})
//