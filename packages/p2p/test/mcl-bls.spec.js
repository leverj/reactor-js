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
    const map = new Keymap()
    mcl.setMappingMode(mcl.MAPPING_MODE_TI)
    mcl.setDomain('testing evmbls')
    const message = stringToHex(messageString)
    map.mcl.secret = secretFromHex(secretHex)
    map.mcl.pubkey = mcl.getPublicKey(secretHex)
    const {signature, M} = mcl.sign(message, map.mcl.secret)
    map.mcl.signature = signature

    map.serialized.pubkey = bls.deserializeHexStrToPublicKey(map.mcl.pubkey.serializeToHexStr())
    map.serialized.secret = bls.deserializeHexStrToSecretKey(map.mcl.secret.serializeToHexStr())
    map.serialized.signature = bls.deserializeHexStrToSignature(map.mcl.signature.serializeToHexStr())

    map.bls.secret = map.serialized.secret
    map.bls.pubkey = map.bls.secret.getPublicKey()
    map.bls.signature = map.bls.secret.sign(messageString)
    map.print()
  })
})

class Keymap {
  constructor() {
    this.mcl = {secret: null, pubkey: null, signature: null}
    this.bls = {secret: null, pubkey: null, signature: null}
    this.serialized = {secret: null, pubkey: null, signature: null}
  }

  print() {
    console.log('secret')
    console.log('mcl', this.mcl.secret.serializeToHexStr())
    console.log('ser', this.serialized.secret.serializeToHexStr())
    console.log('bls', this.bls.secret.serializeToHexStr())
    console.log('public key')
    console.log('mcl', this.mcl.pubkey.serializeToHexStr())
    console.log('ser', this.serialized.pubkey.serializeToHexStr())
    console.log('bls', this.bls.pubkey.serializeToHexStr())
    console.log('signature')
    console.log('mcl', this.mcl.signature.serializeToHexStr())
    console.log('ser', this.serialized.signature.serializeToHexStr())
    console.log('bls', this.bls.signature.serializeToHexStr())
  }
}
