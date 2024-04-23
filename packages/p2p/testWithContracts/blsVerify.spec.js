import {expect}  from 'expect'
import help from '@leverj/layer2-chain/test/help.js'
const {deployContract, getContractFactory, getSigners} = help
import bls from 'bls-wasm'
// import bls from 'bls-eth-wasm'
import mcl  from '@leverj/layer2-chain/test/mcl.js'
import {deserializeHexStrToG1, deserializeHexStrToG2, G1, G2}  from "mcl-wasm/dist/value-types.js"
import {createDkgMembers, signMessage} from '../test/help.js'

function stringToHex(str) {
  let hex = ''
  for (let i = 0; i < str.length; i++) {
    hex += '' + str.charCodeAt(i).toString(16)
  }
  return '0x' + hex
}


const messageString = 'hello world'
describe('dlsVerify', () => {
  let contract, owner, anyone
  before(async () => {
    await mcl.init()

  })
  beforeEach(async () => {
    [owner, anyone] = await getSigners()
    contract = await deployContract('BlsVerify', [])
    await bls.init()
  })

  it('verify single signature', async function () {
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
  it('should match the public key between bls and mcl', async function () {
    const pvtKey = new bls.SecretKey()
    pvtKey.setByCSPRNG()
    //pvtKey.deserializeHexStr('5747501c4fe126ddb0983b7d561808e1211dfcc6aea42866b24dc01564f19a1b');
    console.log('pvtkey', pvtKey.serializeToHexStr())
    const pubKey1 = pvtKey.getPublicKey()
    console.log('blsPubKey', pubKey1.serializeToHexStr());
    
    const mclPubKey = mcl.getPublicKey(pvtKey.serializeToHexStr())
    console.log('mclPubKey', mclPubKey.serializeToHexStr())
    expect(mclPubKey.serializeToHexStr()).toEqual(pubKey1.serializeToHexStr())
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

  it('should verify signature from dkgnodes', async function () {
    const threshold = 4
    const members = createDkgMembers([10314, 30911, 25411, 8608, 31524, 15441, 23399], threshold)
    const {signs, signers} = signMessage(messageString, members)
    const groupsSign = new bls.Signature()
    groupsSign.recover(signs, signers)


    const signatureHex = groupsSign.serializeToHexStr()
    const pubkeyHex = members[0].groupPublicKey.serializeToHexStr()
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
