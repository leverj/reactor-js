import {BlsVerify} from '@leverj/reactor.chain/test'
import {
  deserializeHexStrToSignature,
  deserializeHexStrToPublicKey,
  G1ToNumbers,
  G2ToNumbers,
  hashToPoint,
  Signature,
} from '@leverj/reactor.mcl'
import {expect} from 'expect'
import {createDkgMembers, signMessage} from './help/index.js'

describe('BlsVerify', () => {
  it('should verify signature from dkgnodes', async () => {
    const message = 'hello world'
    const members = await createDkgMembers([10314, 30911, 25411, 8608, 31524, 15441, 23399])
    const {signs, signers} = signMessage(message, members)
    const groupsSign = new Signature()
    groupsSign.recover(signs, signers)
    const signature = deserializeHexStrToSignature(groupsSign.serializeToHexStr())
    const pubkey = deserializeHexStrToPublicKey(members[0].groupPublicKey.serializeToHexStr())
    const message_ser = G1ToNumbers(hashToPoint(message))
    const pubkey_ser = G2ToNumbers(pubkey)
    const sig_ser = G1ToNumbers(signature)
    const contract = await BlsVerify()
    expect(await contract.verifySignature(sig_ser, pubkey_ser, message_ser)).toEqual(true)
  })
})
