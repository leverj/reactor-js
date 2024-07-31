import {logger} from '@leverj/common/utils'
import {getPublicKey, secretFromHex, sign} from '@leverj/reactor.mcl/mcl'
import bls from 'bls-wasm'
import {expect} from 'expect'

const messageString = 'hello world'
describe('mcl-bls', () => {
  before(async () => {
    await bls.init(4)
    const P2 = new bls.PublicKey()
    //https://eips.ethereum.org/EIPS/eip-197
    // P2.setStr('1 11559732032986387107991004021392285783925812861821192530917403151452391805634 10857046999023057135944570762232829481370756359578518086990519993285655852781 4082367875863433681332203403145435568316851327593401208105741076214120093531 8495653923123431417604973247489272438418190587263600148770280649306958101930')
    P2.setStr('1 10857046999023057135944570762232829481370756359578518086990519993285655852781 11559732032986387107991004021392285783925812861821192530917403151452391805634 8495653923123431417604973247489272438418190587263600148770280649306958101930 4082367875863433681332203403145435568316851327593401208105741076214120093531')
    bls.setGeneratorOfPublicKey(P2)
  })

  it('should match the public key between bls and mcl', async () => {
    const pvtKey = new bls.SecretKey()
    pvtKey.setByCSPRNG()
    const pubKey1 = pvtKey.getPublicKey()
    const mclPubKey = getPublicKey(pvtKey.serializeToHexStr())
    expect(mclPubKey.serializeToHexStr()).toEqual(pubKey1.serializeToHexStr())
  })

  //fixme: this test is failing when import for bls is actually from bls-wasm
  it.skip('bls should verify mcl signature', async () => {
    const secretHex = 'a3e9769b84c095eca6b98449ac86b6e2c589834fe24cb8fbb7b36f814fd06113'
    const map = new Keymap(messageString).replenish(secretHex)//.print()
    expect(map.bls.pubkey.serializeToHexStr()).toEqual(map.mcl.pubkey.serializeToHexStr())
    expect(map.bls.signature.serializeToHexStr()).toEqual(map.mcl.signature.serializeToHexStr())
  })

  it('different secrets for different domains', async () => {
    const secretHex = 'a3e9769b84c095eca6b98449ac86b6e2c589834fe24cb8fbb7b36f814fd06113'
    new Keymap(messageString).replenish(secretHex).printSignatures()
  })

  it('should verify mcl signature via pairings', async () => {
    const secretHex = 'a3e9769b84c095eca6b98449ac86b6e2c589834fe24cb8fbb7b36f814fd06113'
    const map = new Keymap(messageString).replenish(secretHex)//.print()
    const secretHex1 = 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcd29'
    const map1 = new Keymap(messageString).replenish(secretHex1)//.print()

    //key1-signature1 : pass
    let verification = map.mcl.pubkey.verify(map.mcl.signature, messageString)
    expect(verification).toEqual(true)
    //key1-signature2: fail
    verification = map.mcl.pubkey.verify(map1.mcl.signature, messageString)
    expect(verification).toEqual(false)
    //key2-signature1: fail
    verification = map1.mcl.pubkey.verify(map.mcl.signature, messageString)
    expect(verification).toEqual(false)
    //key2-signature2: pass
    verification = map1.mcl.pubkey.verify(map1.mcl.signature, messageString)
    expect(verification).toEqual(true)
  })
})

class Keymap {
  constructor(messageString) {
    this.messageString = messageString
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
    this.mcl.secret =secretFromHex(secretHex)
    this.mcl.pubkey = getPublicKey(secretHex)
    this.mcl.signature = sign(this.messageString, this.mcl.secret).signature
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
    logger.log('signature')
    logger.log('mcl', this.mcl.signature.serializeToHexStr())
    logger.log('ser', this.serialized.signature.serializeToHexStr())
    logger.log('bls', this.bls.signature.serializeToHexStr())
    return this
  }

  printPublicKeys() {
    logger.log('public key')
    logger.log('mcl', this.mcl.pubkey.serializeToHexStr())
    logger.log('ser', this.serialized.pubkey.serializeToHexStr())
    logger.log('bls', this.bls.pubkey.serializeToHexStr())
    return this
  }

  printSecrets() {
    logger.log('secret')
    logger.log('mcl', this.mcl.secret.serializeToHexStr())
    logger.log('ser', this.serialized.secret.serializeToHexStr())
    logger.log('bls', this.bls.secret.serializeToHexStr())
    return this
  }
}
