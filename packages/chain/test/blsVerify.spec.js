import {deployContract, getContractFactory, getSigners, stringToHex} from './help.cjs'
import {expect}  from 'expect'
import * as mcl  from './mcl.js'
import {deserializeHexStrToG1, deserializeHexStrToG2, G1, G2}  from "mcl-wasm/dist/value-types.js"

const messageString = 'hello world'
describe('dlsVerify', () => {
  let contract, owner, anyone
  before(async () => {
    await mcl.init()
  })
  beforeEach(async () => {
    [owner, anyone] = await getSigners()
  })

  it('verify single signature', async function () {
    contract = await deployContract('BlsVerify', [])
    mcl.setMappingMode(mcl.MAPPING_MODE_TI)
    mcl.setDomain('testing evmbls')
    const message = stringToHex(messageString)
    const {pubkey, secret} = mcl.newKeyPair()
    const {signature, M} = mcl.sign(message, secret)
    let sig_ser = mcl.g1ToBN(signature)
    let pubkey_ser = mcl.g2ToBN(pubkey)
    let message_ser = mcl.g1ToBN(M)

    let res = await contract.verifySignature(sig_ser, pubkey_ser, message_ser)
    expect(res).toEqual(true)
  })

  it('desrialize before verification', async function () {
    mcl.setMappingMode(mcl.MAPPING_MODE_TI)
    mcl.setDomain('testing evmbls')
    const signatureHex = 'dfe1a5143ec005409814d6bb6b43137671df95d6188b4b565484a617bbe82920'
    const pubkeyHex = '8af630f9a0eb10a6efcf1626ace4164de9bdfff339f9ca57830840f98eafaf0f654b01cd1af08d03bd69e45b4d4c395acf1843d614d97acf2af26a7f73ddd489'
    const M = mcl.hashToPoint(stringToHex(messageString))
    const signature = deserializeHexStrToG1(signatureHex)
    const pubkey = deserializeHexStrToG2(pubkeyHex)
    let message_ser = mcl.g1ToBN(M)
    let pubkey_ser = mcl.g2ToBN(pubkey)
    let sig_ser = mcl.g1ToBN(signature)
    let res = await contract.verifySignature(sig_ser, pubkey_ser, message_ser)
    expect(res).toEqual(true)
  })
})
