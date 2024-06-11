import { expect } from 'expect'
import { deployContract, getSigners, createDkgMembers, signMessage } from './help/index.js'
import bls from '../src/utils/bls.js'

const messageString = 'hello world'
describe('blsVerify', () => {
  let contract, L1DepositContract, owner, anyone
  beforeEach(async () => {
    [owner, anyone] = await getSigners()
    contract = await deployContract('BlsVerify', [])
    L1DepositContract = await deployContract('L1Deposit', [])
  })

  it('verify single signature', async function () {
    // bls.setMappingMode(bls.MAPPING_MODE_TI)
    // bls.setDomain('testing evmbls')
    const message = bls.stringToHex(messageString)
    const { pubkey, secret } = bls.newKeyPair()
    const { signature, M } = bls.sign(message, secret)
    let sig_ser = bls.g1ToBN(signature)
    let pubkey_ser = bls.g2ToBN(pubkey)
    let message_ser = bls.g1ToBN(M)

    let res = await contract.verifySignature(sig_ser, pubkey_ser, message_ser)
    expect(res).toEqual(true)
  })

  it('should verify signature from dkgnodes', async function () {
    const threshold = 4
    const members = await createDkgMembers([10314, 30911, 25411, 8608, 31524, 15441, 23399], threshold)
    const { signs, signers } = signMessage(messageString, members)
    const groupsSign = new bls.Signature()
    groupsSign.recover(signs, signers)


    const signatureHex = groupsSign.serializeToHexStr()
    const pubkeyHex = members[0].groupPublicKey.serializeToHexStr()
    const M = bls.hashToPoint(messageString)

    const signature = bls.deserializeHexStrToG1(signatureHex)
    const pubkey = bls.deserializeHexStrToG2(pubkeyHex)
    let message_ser = bls.g1ToBN(M)
    let pubkey_ser = bls.g2ToBN(pubkey)
    let sig_ser = bls.g1ToBN(signature)
    let res = await contract.verifySignature(sig_ser, pubkey_ser, message_ser)
    expect(res).toEqual(true)
  })

  it('should be able to convert message to point', async function () {
    let res = await contract.hashToPoint(bls.stringToHex('testing evmbls'), bls.stringToHex(messageString))
    let fromJs = bls.g1ToBN(bls.hashToPoint(messageString))
    // console.log('from js', fromJs)
    // console.log('from contract', res)
    expect(res).toEqual(fromJs)
  })
})
