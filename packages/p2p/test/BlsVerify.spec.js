import {BlsVerify} from '@leverj/reactor.chain/test'
import {
  deserializeHexStrToG1,
  deserializeHexStrToG2,
  g1ToBN,
  g2ToBN,
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
    const signature = deserializeHexStrToG1(groupsSign.serializeToHexStr())
    const pubkey = deserializeHexStrToG2(members[0].groupPublicKey.serializeToHexStr())
    const message_ser = g1ToBN(hashToPoint(message))
    const pubkey_ser = g2ToBN(pubkey)
    const sig_ser = g1ToBN(signature)
    const contract = await BlsVerify()
    expect(await contract.verifySignature(sig_ser, pubkey_ser, message_ser)).toEqual(true)
  })
})
