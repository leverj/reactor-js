import {expect} from 'expect'
import bls from 'bls-wasm'
import mcl from '@leverj/layer2-chain/test/mcl.js'
import {stringToHex} from '@leverj/layer2-chain/test/help.js'

const messageString = 'hello world'
describe('mcl-bls', () => {
  before(async () => {
    await mcl.init()
    await bls.init()
  })
  it('should match the public key between bls and mcl', async function () {
    const pvtKey = new bls.SecretKey()
    pvtKey.setByCSPRNG()
    const pubKey1 = pvtKey.getPublicKey()
    const mclPubKey = mcl.getPublicKey('0x' + pvtKey.serializeToHexStr())
    expect(mclPubKey.serializeToHexStr()).toEqual(pubKey1.serializeToHexStr())
  })

  it('bls should verify mcl signature', async function () {
    mcl.setMappingMode(mcl.MAPPING_MODE_TI)
    mcl.setDomain('testing evmbls')
    const message = stringToHex(messageString)
    const {pubkey, secret} = mcl.newKeyPair()
    const {signature, M} = mcl.sign(message, secret)

    let serializeToHexStr = pubkey.serializeToHexStr()
    console.log('pubkey', serializeToHexStr)
    const blspubKey = bls.deserializeHexStrToPublicKey(serializeToHexStr)
  })
})