import {expect} from 'expect'
import bls from 'bls-wasm'
import mcl, {secretFromHex} from '@leverj/layer2-chain/test/mcl.js'
import {stringToHex} from '@leverj/layer2-chain/test/help.js'

const messageString = 'hello world'
describe('mcl-bls', () => {
  before(async () => {
    await mcl.init()
    await bls.init(4)
  })
  it('should match the public key between bls and mcl', async function () {
    const pvtKey = new bls.SecretKey()
    pvtKey.setByCSPRNG()
    const pubKey1 = pvtKey.getPublicKey()
    const mclPubKey = mcl.getPublicKey(pvtKey.serializeToHexStr())
    expect(mclPubKey.serializeToHexStr()).toEqual(pubKey1.serializeToHexStr())
  })

  it('bls should verify mcl signature', async function () {
    const secretHex = 'a3e9769b84c095eca6b98449ac86b6e2c589834fe24cb8fbb7b36f814fd06113'
    mcl.setMappingMode(mcl.MAPPING_MODE_TI)
    mcl.setDomain('testing evmbls')
    const message = stringToHex(messageString)
    const secret = secretFromHex(secretHex)
    const pubkey = mcl.getPublicKey(secretHex)
    const {signature, M} = mcl.sign(message, secret)


    const blspubKey = bls.deserializeHexStrToPublicKey(pubkey.serializeToHexStr())
    const blsSignature = bls.deserializeHexStrToSignature(signature.serializeToHexStr())
    const blsSecret = bls.deserializeHexStrToSecretKey(secret.serializeToHexStr())
    const blsSigned = blsSecret.sign(messageString)
    console.log('pubkey\t\t', pubkey.serializeToHexStr())
    console.log('blspubKey\t', blspubKey.serializeToHexStr())
    console.log('signature\t\t', signature.serializeToHexStr())
    console.log('blsSignature\t', blsSignature.serializeToHexStr())
    console.log('blsSigned\t\t', blsSigned.serializeToHexStr())
    console.log('secret\t\t', secret.serializeToHexStr())
    console.log('blsSecret\t', blsSecret.serializeToHexStr())


    expect(blspubKey.verify(blsSignature, message)).toEqual(true)
  })
})