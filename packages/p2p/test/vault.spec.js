import { expect } from 'expect'
import { createVault, provider } from './help/vault.js'
import { Interface } from 'ethers'
import vaultAbi from '../src/abi/Vault.json' assert {type: 'json'}
import { buffersToHex, keccak256, toBuffer, uint } from '@leverj/gluon-plasma.common/src/utils/ethereum.js'

import { deployContract, getSigners, createDkgMembers, signMessage } from './help/index.js'
import bls from '../src/utils/bls.js'

const cipher_suite_domain = 'BN256-HASHTOPOINT';
bls.setDomain(cipher_suite_domain);
describe('vault contract', function () {

  it('should be able to deposit ether', async function () {
    const threshold = 4
    const members = await createDkgMembers([10314, 30911, 25411, 8608, 31524, 15441, 23399], threshold)
    const pubkeyHex = members[0].groupPublicKey.serializeToHexStr()
    const pubkey = bls.deserializeHexStrToG2(pubkeyHex)
    let pubkey_ser = bls.g2ToBN(pubkey)
    let member_pub_key = bls.deserializeHexStrToG2(members[0].publicKey.serializeToHexStr())
    let member_pub_key_g2 = bls.g2ToBN(member_pub_key)
    const contract = await createVault(pubkey_ser)
    const amount = BigInt(1e+6)
    const toChain = 10101
    const txnReceipt = await (await contract.depositEth(toChain, { value: amount })).wait()
    const logs = await provider.getLogs(txnReceipt)
    for (const log of logs) {
      const parsedLog = new Interface(vaultAbi.abi).parseLog(log)
      let isDeposited = await contract.isDeposited(parsedLog.args[0], parsedLog.args[1], BigInt(parsedLog.args[2]), BigInt(parsedLog.args[3]), BigInt(parsedLog.args[4]))
      expect(isDeposited).toEqual(true)
      //Changing even one data point should fail
      isDeposited = await contract.isDeposited(parsedLog.args[1], parsedLog.args[0], BigInt(parsedLog.args[2]), BigInt(parsedLog.args[3]), BigInt(parsedLog.args[4]))
      expect(isDeposited).toEqual(false)
      isDeposited = await contract.isDeposited(parsedLog.args[0], parsedLog.args[1], BigInt(parsedLog.args[2]), BigInt(parsedLog.args[4]), BigInt(parsedLog.args[3]))
      expect(isDeposited).toEqual(false)
      const hashOf = await contract.hashOf(parsedLog.args[0], parsedLog.args[1], BigInt(parsedLog.args[2]), BigInt(parsedLog.args[3]), BigInt(parsedLog.args[4]));
      console.log("hashOf", hashOf);
      //Compute hash off-chain and check deposit status
      const hashOffChain = keccak256(parsedLog.args[0], parsedLog.args[1], BigInt(parsedLog.args[2]).toString(), BigInt(parsedLog.args[3]).toString(), BigInt(parsedLog.args[4]).toString())
      expect(hashOf).toEqual(hashOffChain)
      isDeposited = await contract.deposited(hashOffChain)
      expect(isDeposited).toEqual(true)

      const messageString = hashOffChain
      const { signs, signers } = signMessage(messageString, members)
      const groupsSign = new bls.Signature()
      groupsSign.recover(signs, signers)


      const signatureHex = groupsSign.serializeToHexStr()

      const M = bls.hashToPoint(messageString)

      const signature = bls.deserializeHexStrToG1(signatureHex)

      let message_ser = bls.g1ToBN(M)

      let sig_ser = bls.g1ToBN(signature)
      let res = await contract.verifySignature(sig_ser, pubkey_ser, message_ser, messageString, parsedLog.args[0], parsedLog.args[1], BigInt(parsedLog.args[2]), BigInt(parsedLog.args[3]), BigInt(parsedLog.args[4]))
      expect(res).toEqual(true)
      //Sending Public key of member (i.e. wrong pub key)
      await expect(contract.verifySignature(sig_ser, member_pub_key_g2, message_ser, messageString, parsedLog.args[0], parsedLog.args[1], BigInt(parsedLog.args[2]), BigInt(parsedLog.args[3]), BigInt(parsedLog.args[4]))).rejects.toThrow(/Invalid Public Key/)

    }
    expect(await provider.getBalance(await contract.getAddress())).toEqual(amount)
  })
})