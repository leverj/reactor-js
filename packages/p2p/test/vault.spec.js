import { expect } from 'expect'
import { createVault, provider } from './help/vault.js'
import { Interface } from 'ethers'
import vaultAbi from '../src/abi/Vault.json' assert {type: 'json'}
import { buffersToHex, keccak256, toBuffer, uint } from '@leverj/gluon-plasma.common/src/utils/ethereum.js'
import { peerIdJsons} from './help/index.js'
import {setTimeout} from 'timers/promises'
import BridgeNode from '../src/BridgeNode.js'
import { deployContract, getSigners, createDkgMembers, signMessage } from './help/index.js'
import bls from '../src/utils/bls.js'

import Deposit from '../src/deposit_withdraw/Deposit.js'

const cipher_suite_domain = 'BN256-HASHTOPOINT';
bls.setDomain(cipher_suite_domain);

const nodes = []
const stopBridgeNodes = async () => {
  for (const deposit of nodes) await deposit.bridgeNode.stop()
  nodes.length = 0
}
const createBridgeNodes = async (count) => {
  const network = await provider.getNetwork()
  const bootstraps = []
  for (let i = 0; i < count; i++) {
    // fixme: get peerid from config eventually some file
    const node = new BridgeNode({port: 9000 + i, isLeader: i === 0, json: {p2p: peerIdJsons[i]}, bootstrapNodes: bootstraps})
    await node.create()
    const deposit = new Deposit(node)
    node.setDeposit(deposit)
    nodes.push(deposit)
    if(i === 0) bootstraps.push(node.multiaddrs[0])
  }
  return nodes
}
describe('vault contract', function () {
  afterEach(async () => await stopBridgeNodes())
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

      let sig_ser = bls.g1ToBN(signature)
      let res = await contract.mint(sig_ser, pubkey_ser, parsedLog.args[0], parsedLog.args[1], BigInt(parsedLog.args[2]), BigInt(parsedLog.args[3]), BigInt(parsedLog.args[4]))
      expect(res).toEqual(true)
      //Sending Public key of member (i.e. wrong pub key)
      await expect(contract.mint(sig_ser, member_pub_key_g2, parsedLog.args[0], parsedLog.args[1], BigInt(parsedLog.args[2]), BigInt(parsedLog.args[3]), BigInt(parsedLog.args[4]))).rejects.toThrow(/Invalid Public Key/)

    }
    expect(await provider.getBalance(await contract.getAddress())).toEqual(amount)
  })
  it('should invoke Deposit workflow on receipt of message', async function(){
    const network = await provider.getNetwork()
    const toChain = 10101
    const [leader, node1, node2, node3, node4, node5, node6] = await createBridgeNodes(7)
    await leader.bridgeNode.publishWhitelist()
    await leader.bridgeNode.startDKG(4)
    await setTimeout(1000)
    const pubkeyHex = leader.bridgeNode.tssNode.groupPublicKey.serializeToHexStr()
    const pubkey = bls.deserializeHexStrToG2(pubkeyHex)
    let pubkey_ser = bls.g2ToBN(pubkey)
    const contract = await createVault(pubkey_ser)
    for (const node of [leader, node1, node2, node3, node4, node5, node6]){
      node.setContract(network.chainId, contract)
    }
    leader.setContract(toChain, contract)
    const amount = BigInt(1e+6)
    
    const txnReceipt = await (await contract.depositEth(toChain, { value: amount })).wait()
    const logs = await provider.getLogs(txnReceipt)
    for (const log of logs) {
      await leader.processDepositLog(network.chainId, log)
    }
  })
})