import {
  deserializeHexStrToG1,
  deserializeHexStrToG2,
  g1ToBN,
  g2ToBN,
  hashToPoint,
  newKeyPair,
  sign,
  Signature,
  stringToHex,
} from '@leverj/reactor.mcl'
import {expect} from 'expect'
import {deployContract} from './help/hardhat.js'
import {createDkgMembers, signMessage} from './help/index.js'

describe('BlsVerify', () => {
  const messageString = 'hello world'
  let contract

  beforeEach(async () => contract = await deployContract('BlsVerify', []))

  it('verify single signature', async () => {
    const message = stringToHex(messageString)
    const {pubkey, secret} = newKeyPair()
    const {signature, M} = sign(message, secret)
    const sig_ser = g1ToBN(signature)
    const pubkey_ser = g2ToBN(pubkey)
    const message_ser = g1ToBN(M)
    const res = await contract.verifySignature(sig_ser, pubkey_ser, message_ser)
    expect(res).toEqual(true)
  })

  it('should verify signature from dkgnodes', async () => {
    const threshold = 4
    const members = await createDkgMembers([10314, 30911, 25411, 8608, 31524, 15441, 23399], threshold)
    const {signs, signers} = signMessage(messageString, members)
    const groupsSign = new Signature()
    groupsSign.recover(signs, signers)
    const signatureHex = groupsSign.serializeToHexStr()
    const pubkeyHex = members[0].groupPublicKey.serializeToHexStr()
    const M = hashToPoint(messageString)
    const signature = deserializeHexStrToG1(signatureHex)
    const pubkey = deserializeHexStrToG2(pubkeyHex)
    const message_ser = g1ToBN(M)
    const pubkey_ser = g2ToBN(pubkey)
    const sig_ser = g1ToBN(signature)
    const res = await contract.verifySignature(sig_ser, pubkey_ser, message_ser)
    expect(res).toEqual(true)
  })

  it('should be able to convert message to point', async () => {
    const res = await contract.hashToPoint(stringToHex(messageString))
    const fromJs = g1ToBN(hashToPoint(messageString))
    expect(res.map(_ => _.toString())).toEqual(fromJs)
  })
})
