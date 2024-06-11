import bls from 'bls-wasm'
import mcl from 'mcl-wasm'
import {expect} from 'expect'

describe('mcl-bls-herumi', () => {
  it('should match the signature between bls-wasm and mcl-wasm', async function () {

    await bls.init(4)
    bls.setMapToMode(0)
    await mcl.init(mcl.BN_SNARK1)
    mcl.setMapToMode(0)

    const messageStr = 'hello world'
    const secretHex = 'a3e9769b84c095eca6b98449ac86b6e2c589834fe24cb8fbb7b36f814fd06113'

    const secret = bls.deserializeHexStrToSecretKey(secretHex)
    const sign_bls_wasm = secret.sign(messageStr)

    const hashToG1 = await mcl.hashAndMapToG1(messageStr)
    const Fr = new mcl.Fr()
    Fr.deserialize(Uint8Array.from(secret.serialize()))
    const sign_mcl_wasm = mcl.mul(hashToG1, Fr)
    expect(sign_bls_wasm.serializeToHexStr()).toEqual(sign_mcl_wasm.serializeToHexStr())
  })
})
