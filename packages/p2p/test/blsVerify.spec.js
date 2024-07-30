import {expect} from 'expect'
import {bls} from '../src/utils/index.js'
import {createDkgMembers, deployContract, getSigners, signMessage} from './help/index.js'

describe('blsVerify', () => {
  const messageString = 'hello world'
  let contract, owner, anyone

  beforeEach(async () => {
    [owner, anyone] = await getSigners()
    contract = await deployContract('BlsVerify', [])
  })

  it('verify single signature', async function () {
    const message = bls.stringToHex(messageString)
    const {pubkey, secret} = bls.newKeyPair()
    const {signature, M} = bls.sign(message, secret)
    const sig_ser = bls.g1ToBN(signature)
    const pubkey_ser = bls.g2ToBN(pubkey)
    const message_ser = bls.g1ToBN(M)
    const res = await contract.verifySignature(sig_ser, pubkey_ser, message_ser)
    expect(res).toEqual(true)
  })

  it('should verify signature from dkgnodes', async function () {
    const threshold = 4
    const members = await createDkgMembers([10314, 30911, 25411, 8608, 31524, 15441, 23399], threshold)
    const {signs, signers} = signMessage(messageString, members)
    const groupsSign = new bls.Signature()
    groupsSign.recover(signs, signers)
    const signatureHex = groupsSign.serializeToHexStr()
    const pubkeyHex = members[0].groupPublicKey.serializeToHexStr()
    const M = bls.hashToPoint(messageString)
    const signature = bls.deserializeHexStrToG1(signatureHex)
    const pubkey = bls.deserializeHexStrToG2(pubkeyHex)
    const message_ser = bls.g1ToBN(M)
    const pubkey_ser = bls.g2ToBN(pubkey)
    const sig_ser = bls.g1ToBN(signature)
    const res = await contract.verifySignature(sig_ser, pubkey_ser, message_ser)
    expect(res).toEqual(true)
  })

  it('should be able to convert message to point', async function () {
    const res = await contract.hashToPoint(bls.stringToHex(messageString))
    const fromJs = bls.g1ToBN(bls.hashToPoint(messageString))
    expect(res.map(_ => _.toString())).toEqual(fromJs)
  })
})
