import {expect} from 'expect'
import bls from '../src/bls-custom.js'
import * as mcl from '../src/mcl/mcl.js'

const messageString = 'hello world'
describe('mcl-bls', () => {
  before(async () => {
    await mcl.init()
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
    const map = new Keymap(messageString).replenish(secretHex).print()
    expect(map.bls.pubkey.serializeToHexStr()).toEqual(map.mcl.pubkey.serializeToHexStr())
    expect(map.bls.signature.serializeToHexStr()).toEqual(map.mcl.signature.serializeToHexStr())
  })

  it('different secrets for different domains', async function () {
    const secretHex = 'a3e9769b84c095eca6b98449ac86b6e2c589834fe24cb8fbb7b36f814fd06113'
    new Keymap(messageString, 'testing evmbls').replenish(secretHex).printSignatures()
    new Keymap(messageString, 'testing evmbls2').replenish(secretHex).printSignatures()
    new Keymap(messageString, 'something').replenish(secretHex).printSignatures()
  })
})

class Keymap {
  constructor(messageString, domain = 'testing evmbls') {
    this.messageString = messageString
    mcl.setMappingMode(mcl.MAPPING_MODE_TI)
    mcl.setDomain(domain)
    this.mcl = {secret: null, pubkey: null, signature: null}
    this.bls = {secret: null, pubkey: null, signature: null}
    this.serialized = {secret: null, pubkey: null, signature: null}
  }
  replenish(secretHex) {
    this.replenishMcl(secretHex)
    this.serializeBls()
    this.setBls()
    return this
  }
  replenishMcl(secretHex) {
    this.mcl.secret = mcl.secretFromHex(secretHex)
    this.mcl.pubkey = mcl.getPublicKey(secretHex)
    this.mcl.signature = mcl.sign(mcl.stringToHex(this.messageString), this.mcl.secret).signature
    return this
  }

  serializeBls() {
    this.serialized.secret = bls.deserializeHexStrToSecretKey(this.mcl.secret.serializeToHexStr())
    this.serialized.pubkey = bls.deserializeHexStrToPublicKey(this.mcl.pubkey.serializeToHexStr())
    this.serialized.signature = bls.deserializeHexStrToSignature(this.mcl.signature.serializeToHexStr())
    return this
  }

  setBls() {
    this.bls.secret = this.serialized.secret
    this.bls.pubkey = this.bls.secret.getPublicKey()
    this.bls.signature = this.bls.secret.sign(this.messageString)
    return this
  }

  print() {
    this.printSecrets()
    this.printPublicKeys()
    this.printSignatures()
    return this
  }

  printSignatures() {
    console.log('signature')
    console.log('mcl', this.mcl.signature.serializeToHexStr())
    console.log('ser', this.serialized.signature.serializeToHexStr())
    console.log('bls', this.bls.signature.serializeToHexStr())
    return this
  }

  printPublicKeys() {
    console.log('public key')
    console.log('mcl', this.mcl.pubkey.serializeToHexStr())
    console.log('ser', this.serialized.pubkey.serializeToHexStr())
    console.log('bls', this.bls.pubkey.serializeToHexStr())
    return this
  }

  printSecrets() {
    console.log('secret')
    console.log('mcl', this.mcl.secret.serializeToHexStr())
    console.log('ser', this.serialized.secret.serializeToHexStr())
    console.log('bls', this.bls.secret.serializeToHexStr())
    return this
  }
}
