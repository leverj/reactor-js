import {expect} from 'expect'
import bls from 'bls-wasm'
import mcl from '@leverj/layer2-chain/test/mcl.js'

describe('mcl-bls', () => {
  before(async () => {
    await mcl.init()
    await bls.init()
  })
  it('should match the public key between bls and mcl', async function () {
    const pvtKey = new bls.SecretKey()
    pvtKey.setByCSPRNG()
    const pubKey1 = pvtKey.getPublicKey()
    const mclPubKey = mcl.getPublicKey(pvtKey.serializeToHexStr())
    expect(mclPubKey.serializeToHexStr()).toEqual(pubKey1.serializeToHexStr())
  })
})