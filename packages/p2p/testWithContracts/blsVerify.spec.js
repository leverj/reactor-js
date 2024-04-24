import {expect}  from 'expect'
import {deployContract, getSigners} from './help.cjs'
import bls from '../src/bls.js'
import * as mcl  from '../src/mcl/mcl.js'
import {deserializeHexStrToG1, deserializeHexStrToG2}  from "mcl-wasm"
import {createDkgMembers, signMessage} from '../test/help.js'

const messageString = 'hello world'
describe('blsVerify', () => {
  let contract, owner, anyone
  before(async () => {
    await mcl.init()
  })
  beforeEach(async () => {
    [owner, anyone] = await getSigners()
    contract = await deployContract('BlsVerify', [])
  })

  it('verify single signature', async function () {
    mcl.setMappingMode(mcl.MAPPING_MODE_TI)
    mcl.setDomain('testing evmbls')
    const message = mcl.stringToHex(messageString)
    const {pubkey, secret} = mcl.newKeyPair()
    const {signature, M} = mcl.sign(message, secret)
    let sig_ser = mcl.g1ToBN(signature)
    let pubkey_ser = mcl.g2ToBN(pubkey)
    let message_ser = mcl.g1ToBN(M)

    let res = await contract.verifySignature(sig_ser, pubkey_ser, message_ser)
    expect(res).toEqual(true)
  })

  it('should verify signature from dkgnodes', async function () {
    const threshold = 4
    const members = createDkgMembers([10314, 30911, 25411, 8608, 31524, 15441, 23399], threshold)
    const {signs, signers} = signMessage(messageString, members)
    const groupsSign = new bls.Signature()
    groupsSign.recover(signs, signers)


    const signatureHex = groupsSign.serializeToHexStr()
    const pubkeyHex = members[0].groupPublicKey.serializeToHexStr()
    const M = mcl.hashToPoint(mcl.stringToHex(messageString))

    const signature = deserializeHexStrToG1(signatureHex)
    const pubkey = deserializeHexStrToG2(pubkeyHex)
    let message_ser = mcl.g1ToBN(M)
    let pubkey_ser = mcl.g2ToBN(pubkey)
    let sig_ser = mcl.g1ToBN(signature)
    let res = await contract.verifySignature(sig_ser, pubkey_ser, message_ser)
    expect(res).toEqual(true)
  })
})
