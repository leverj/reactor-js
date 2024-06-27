import { expect } from 'expect'
import { createVault, provider, owner, account1, createERC20Token } from './help/vault.js'
import { Interface, solidityPackedKeccak256, solidityPackedSha256 } from 'ethers'
import vaultAbi from '../src/abi/Vault.json' assert {type: 'json'}
import { keccak256, abi, solidityPack } from '@leverj/gluon-plasma.common/src/utils/ethereum.js'
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
const createDepositNodes = async (count) => {
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
const depositOnL1 = async (L1_Chain, L2_Chain, amount) => {
    const [leader, node1, node2, node3, node4, node5, node6] = await createDepositNodes(7)
    await leader.bridgeNode.publishWhitelist()
    await leader.bridgeNode.startDKG(4)
    await setTimeout(1000)
    const pubkeyHex = leader.bridgeNode.tssNode.groupPublicKey.serializeToHexStr()
    const pubkey = bls.deserializeHexStrToG2(pubkeyHex)
    let pubkey_ser = bls.g2ToBN(pubkey)
    const L1_contract = await createVault(pubkey_ser)
    const L2_Contract = await createVault(pubkey_ser)
    for (const node of [leader, node1, node2, node3, node4, node5, node6]){
      node.setContract(L1_Chain, L1_contract)
      node.setContract(L2_Chain, L2_Contract)
    }
    const txnReceipt = await L1_contract.depositEth(L2_Chain, { value: amount }).then(tx => tx.wait())
    const logs = await provider.getLogs(txnReceipt)
    for (const log of logs) {
      await leader.processDeposit(L1_Chain, log)
      await setTimeout(1000)
    }
    return {L1_contract, L2_Contract, 'nodes': [leader, node1, node2, node3, node4, node5, node6]}  
}
describe('vault contract', function () {
  afterEach(async () => await stopBridgeNodes())
  //fixme this TC can be deleted in couple of weeks. this TC was to initiate the dev, and code has progressed to several levels up
  it.skip('should be able to deposit ether', async function () {
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
      const depositor = parsedLog.args[0]
      const tokenAddress = parsedLog.args[1]
      const decimals = parsedLog.args[2]
      const toChainId = parsedLog.args[3]
      const amount = parsedLog.args[4]
      const depositCounter = parsedLog.args[5]
      const hashOnChain = await contract.hashOf(depositor, tokenAddress, BigInt(decimals), BigInt(toChainId), BigInt(amount), BigInt(depositCounter));
      //Compute hash off-chain and check deposit status
      const depositHash = keccak256(depositor, tokenAddress, BigInt(decimals).toString(), BigInt(toChainId).toString(), BigInt(amount).toString(), BigInt(depositCounter).toString())
      expect(hashOnChain).toEqual(depositHash)
      const isDeposited = await contract.deposits(depositHash)
      expect(isDeposited).toEqual(true)

      const messageString = depositHash
      const { signs, signers } = signMessage(messageString, members)
      const groupsSign = new bls.Signature()
      groupsSign.recover(signs, signers)
      const signatureHex = groupsSign.serializeToHexStr()
      const M = bls.hashToPoint(messageString)
      const signature = bls.deserializeHexStrToG1(signatureHex)
      let sig_ser = bls.g1ToBN(signature)
      //console.log({sig_ser, pubkey_ser, depositor, tokenAddress, decimals, toChainId, amount, depositCounter})
      await contract.mint(sig_ser, pubkey_ser, depositor, tokenAddress, BigInt(decimals), BigInt(toChainId), BigInt(amount), BigInt(depositCounter))
      const res = await contract.minted(depositHash)
      expect(res).toEqual(true)
      //Sending Public key of member (i.e. wrong pub key)
      await expect(contract.mint(sig_ser, member_pub_key_g2, depositor, tokenAddress, BigInt(decimals), BigInt(toChainId), BigInt(amount), BigInt(depositCounter))).rejects.toThrow(/Invalid Public Key/)

    }
    expect(await provider.getBalance(await contract.getAddress())).toEqual(amount)
  })
  it('should invoke Deposit workflow on receipt of message', async function(){
    const network = await provider.getNetwork()
    const toChain = 10101
    const [leader, node1, node2, node3, node4, node5, node6] = await createDepositNodes(7)
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
    const L2_Contract = await createVault(pubkey_ser)
    leader.setContract(toChain, L2_Contract)
    const amount = BigInt(1e+6)
    
    const txnReceipt = await contract.depositEth(toChain, { value: amount }).then(tx => tx.wait())
    const logs = await provider.getLogs(txnReceipt)
    for (const log of logs) {
      const depositHash = await leader.processDeposit(network.chainId, log)
      await setTimeout(1000)
      const minted = await L2_Contract.minted(depositHash)
      expect(minted).toEqual(true)
      //Check the balance of the minted proxy for the depositor in the target chain
      const proxyToken = await L2_Contract.proxyTokenMap(BigInt(network.chainId).toString(), '0x0000000000000000000000000000000000000000')
      const proxyBalanceOfDepositor = await L2_Contract.balanceOf(proxyToken, owner.address)
      console.log('proxyToken', proxyToken, proxyBalanceOfDepositor)
      expect(amount).toEqual(proxyBalanceOfDepositor)
    }
  })
  it('should deposit ERC20 on source chain and mint on target chain', async function(){
    const erc20 = await createERC20Token('L2Test', 'L2Test', 12, '0x0000000000000000000000000000000000000000', 1)
    await erc20.mint(account1, 1e9)
    const network = await provider.getNetwork()
    const toChain = 10101
    const [leader, node1, node2, node3, node4, node5, node6] = await createDepositNodes(7)
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
    const L2_Contract = await createVault(pubkey_ser)
    leader.setContract(toChain, L2_Contract)
    const amount = BigInt(1e+6)
    const erc20WithAccount1 = erc20.connect(account1)
    await erc20WithAccount1.approve(contract.target, 1000000, {from: account1.address}).then(tx => tx.wait())
    const contractWithAccount1 = contract.connect(account1);
    const txReceipt = await contractWithAccount1.depositToken(toChain, erc20.target, amount).then(tx => tx.wait())
    const logs = await provider.getLogs(txReceipt)
    //console.log(logs)
    const depositHash = await leader.processDeposit(network.chainId, logs[1])
    await setTimeout(1000)
    const minted = await L2_Contract.minted(depositHash)
    expect(minted).toEqual(true)
    const proxyToken = await L2_Contract.proxyTokenMap(BigInt(network.chainId).toString(), erc20.target)
    const proxyBalanceOfDepositor = await L2_Contract.balanceOf(proxyToken, account1)
    console.log('proxyToken', proxyToken, proxyBalanceOfDepositor)
    expect(amount).toEqual(proxyBalanceOfDepositor)  
  })

  it('should mint token using fixture data', async function(){
    const network = await provider.getNetwork()
    const fixture = {
      sig_ser: [
        '17501379548414473118975493418296770409004790518587989275104077991423278766345',
        '10573459840926036933226410278548182531900093958496894445083855256191507622572'
      ],
      pubkey_ser: [
        '17952266123624120693867949189877327115939693121746953888788663343366186261263',
        '3625386958213971493190482798835911536597490696820041295198885612842303573644',
        '14209805107538060976447556508818330114663332071460618570948978043188559362801',
        '6106226559240500500676195643085343038285250451936828952647773685858315556632'
      ],
      depositor: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      tokenAddress: '0x0000000000000000000000000000000000000000',
      decimals: 18n,
      toChainId: 10101n,
      amount: 1000000n,
      depositCounter: 0n
    }
    const contract = await createVault(fixture.pubkey_ser)
    const name = "PROXY_NAME" //fixme this can be 'constant' or derived from the original token. ultimately, it's always the address that's the unique/primary key
    const symbol = "PROXY_SYMBOL"
    await contract.mint(fixture.sig_ser, fixture.pubkey_ser, abi.encode(["address", "address", "uint", "uint", "uint", "uint", "uint", "string", "string"], [fixture.depositor, fixture.tokenAddress, BigInt(fixture.decimals), BigInt(network.chainId),BigInt(fixture.toChainId), BigInt(fixture.amount), BigInt(fixture.depositCounter), name, symbol]))
    await setTimeout(1000)
    const depositHash = keccak256(fixture.depositor, fixture.tokenAddress, BigInt(fixture.decimals).toString(), BigInt(fixture.toChainId).toString(), BigInt(fixture.amount).toString(), BigInt(fixture.depositCounter).toString())
    const minted = await contract.minted(depositHash)
    expect(minted).toEqual(true)
    const proxyToken = await contract.proxyTokenMap(BigInt(network.chainId).toString(), fixture.tokenAddress)
    const proxyBalanceOfDepositor = await contract.balanceOf(proxyToken, fixture.depositor)
    expect(fixture.amount).toEqual(proxyBalanceOfDepositor)

  })
  //These can be deleted and along with contract testing functions around encode/decode
  it.skip("should test encode decode", async function(){
    const fixture = {
      sig_ser: [
        '17501379548414473118975493418296770409004790518587989275104077991423278766345',
        '10573459840926036933226410278548182531900093958496894445083855256191507622572'
      ],
      pubkey_ser: [
        '17952266123624120693867949189877327115939693121746953888788663343366186261263',
        '3625386958213971493190482798835911536597490696820041295198885612842303573644',
        '14209805107538060976447556508818330114663332071460618570948978043188559362801',
        '6106226559240500500676195643085343038285250451936828952647773685858315556632'
      ],
      depositor: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      tokenAddress: '0x0000000000000000000000000000000000000000',
      decimals: 18n,
      toChainId: 10101n,
      amount: 1000000n,
      depositCounter: 0n
    }
    const contract = await createVault(fixture.pubkey_ser);
    //await contract.testEncodePacked(abi.encode(["address", "address", "uint"], [fixture.depositor, fixture.tokenAddress, BigInt(fixture.amount).toString()]));
    await contract.testEncodeInputPlusLocal_PartialExtraction(abi.encode(["address", "address", "uint", "uint", "uint", "uint", "string", "string", "string", "string", "string", "string"], [fixture.depositor, fixture.tokenAddress, BigInt(fixture.decimals), BigInt(fixture.toChainId), BigInt(fixture.amount), BigInt(fixture.depositCounter), "stringData7", "stringData8", "stringData9", "stringData10", "stringData11", "stringData12"]));
  })
  it.skip("should test encode packed", async function(){
    const fixture = {
      sig_ser: [
        '17501379548414473118975493418296770409004790518587989275104077991423278766345',
        '10573459840926036933226410278548182531900093958496894445083855256191507622572'
      ],
      pubkey_ser: [
        '17952266123624120693867949189877327115939693121746953888788663343366186261263',
        '3625386958213971493190482798835911536597490696820041295198885612842303573644',
        '14209805107538060976447556508818330114663332071460618570948978043188559362801',
        '6106226559240500500676195643085343038285250451936828952647773685858315556632'
      ],
      depositor: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      tokenAddress: '0x0000000000000000000000000000000000000000',
      decimals: 18n,
      toChainId: 10101n,
      amount: 1000000n,
      depositCounter: 0n
    }
    const contract = await createVault(fixture.pubkey_ser);
    await contract.testEncode(solidityPack(["address", "address", "uint", "uint", "uint", "uint"], [fixture.depositor, fixture.tokenAddress, BigInt(fixture.decimals), BigInt(fixture.toChainId), BigInt(fixture.amount), BigInt(fixture.depositCounter)]));
  })

  it('should disburse when withdrawn from target chain', async function() {
    const network = await provider.getNetwork()
    const L1_Chain = network.chainId
    const L2_Chain = 10101
    const amount = BigInt(1e+6)
    
    const {L1_contract, L2_Contract, nodes:[leader, node1, node2, node3, node4, node5, node6]} = await depositOnL1(L1_Chain, L2_Chain, amount)
    const proxyToken = await L2_Contract.proxyTokenMap(BigInt(network.chainId).toString(), '0x0000000000000000000000000000000000000000')
    let proxyBalanceOfDepositor = await L2_Contract.balanceOf(proxyToken, owner.address)
    expect(amount).toEqual(proxyBalanceOfDepositor)   
    const withdrawReceipt = await L2_Contract.withdrawEth(L1_Chain, amount).then(tx => tx.wait())
    proxyBalanceOfDepositor = await L2_Contract.balanceOf(proxyToken, owner.address)
    expect(BigInt(0)).toEqual(proxyBalanceOfDepositor)
    console.log("L2 Contract", L2_Contract.target)   
    const logs = await provider.getLogs(withdrawReceipt)
    for (const log of logs){
      if (log.address == L2_Contract.target) await leader.processWithdraw(L2_Chain, log)
    }
    await setTimeout(1000)
    /*
    L2: withdraw
         burn
         withdrawn(withdrawHash(account, token originating address, token originating chain, amount, withdrawCounter), true)
    L1: disburse
        check disbursed(withdrawHash) !== true
        transfer original token and amount to account
     */
  })

  it('should mint when withdrawn from target chain to not an originating chain', async function() {
    /*
    L2: withdraw
         burn
         withdrawn(withdrawHash(account, token originating address, token originating chain, amount, withdrawCounter), true)
    L3: mint
        check minted(withdrawHash) !== true
        mint token to account
     */
  })
})