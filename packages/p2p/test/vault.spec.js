import {expect} from 'expect'
import {createVault, provider, owner, account1, createERC20Token} from './help/vault.js'
import {Interface, solidityPackedKeccak256, solidityPackedSha256, formatEther, AbiCoder} from 'ethers'
import vaultAbi from '../src/abi/Vault.json' assert {type: 'json'}
import {keccak256} from '@leverj/gluon-plasma.common/src/utils/ethereum.js'
import {peerIdJsons} from './help/index.js'
import {setTimeout} from 'timers/promises'
import BridgeNode from '../src/BridgeNode.js'
import {deployContract, getSigners, createDkgMembers, signMessage} from './help/index.js'
import bls from '../src/utils/bls.js'
import Deposit from '../src/deposit_withdraw/Deposit.js'

const abi = AbiCoder.defaultAbiCoder()
const cipher_suite_domain = 'BN256-HASHTOPOINT'
bls.setDomain(cipher_suite_domain)

const nodes = []
const stopBridgeNodes = async () => {
  for (const deposit of nodes) await deposit.bridgeNode.stop()
  nodes.length = 0
}
const createDepositNodes = async (count) => {
  const bootstraps = []
  for (let i = 0; i < count; i++) {
    const node = new BridgeNode({port: 9000 + i, isLeader: i === 0, json: {p2p: peerIdJsons[i]}, bootstrapNodes: bootstraps})
    await node.create()
    const deposit = new Deposit(node)
    node.setDeposit(deposit)
    nodes.push(deposit)
    if (i === 0) bootstraps.push(node.multiaddrs[0])
  }
  return nodes
}
const _setContractsOnNodes = async (L1_Chain, L2_Chain, [leader, node1, node2, node3, node4, node5, node6]) => {
  await leader.bridgeNode.publishWhitelist()
  await leader.bridgeNode.startDKG(4)
  await setTimeout(1000)
  const pubkeyHex = leader.bridgeNode.tssNode.groupPublicKey.serializeToHexStr()
  const pubkey = bls.deserializeHexStrToG2(pubkeyHex)
  let pubkey_ser = bls.g2ToBN(pubkey)
  const L1_Contract = await createVault(L1_Chain, pubkey_ser)
  const L2_Contract = await createVault(L2_Chain, pubkey_ser)
  for (const node of [leader, node1, node2, node3, node4, node5, node6]) {
    node.setContract(L1_Chain, L1_Contract)
    node.setContract(L2_Chain, L2_Contract)
  }
  return {L1_Contract, L2_Contract}
}
const depositETHOnL1 = async (L1_Chain, L2_Chain, amount) => {
  const [leader, node1, node2, node3, node4, node5, node6] = await createDepositNodes(7)
  const {L1_Contract, L2_Contract} = await _setContractsOnNodes(L1_Chain, L2_Chain, [leader, node1, node2, node3, node4, node5, node6])
  const txnReceipt = await L1_Contract.depositEth(L2_Chain, {value: amount}).then(tx => tx.wait())
  const logs = await provider.getLogs(txnReceipt)
  let depositHash
  for (const log of logs) {
    depositHash = await leader.processDeposit(L1_Chain, log)
    await setTimeout(1000)
  }
  return {L2_Contract, leader, depositHash}
}
const depositERC20OnL1 = async (L1_Chain, L2_Chain, amount) => {
  const [leader, node1, node2, node3, node4, node5, node6] = await createDepositNodes(7)
  const {L1_Contract, L2_Contract} = await _setContractsOnNodes(L1_Chain, L2_Chain, [leader, node1, node2, node3, node4, node5, node6])
  const erc20 = await createERC20Token('L2Test', 'L2Test', 12, '0x0000000000000000000000000000000000000000', 1)
  await erc20.mint(account1, 1e9)
  const erc20WithAccount1 = erc20.connect(account1)
  await erc20WithAccount1.approve(L1_Contract.target, 1000000, {from: account1.address}).then(tx => tx.wait())
  const contractWithAccount1 = L1_Contract.connect(account1)
  const txReceipt = await contractWithAccount1.depositToken(L2_Chain, erc20.target, amount).then(tx => tx.wait())
  const logs = await provider.getLogs(txReceipt)
  const depositHash = await leader.processDeposit(L1_Chain, logs[1])
  return {L2_Contract, leader, depositHash, erc20}
}
describe('vault contract', function () {
  afterEach(async () => await stopBridgeNodes())
  it('should invoke Deposit workflow on receipt of message', async function () {
    const network = await provider.getNetwork()
    const L1_Chain = network.chainId
    const L2_Chain = 10101
    const amount = BigInt(1e+19)
    const {L1_Contract, L2_Contract, depositHash} = await depositETHOnL1(L1_Chain, L2_Chain, amount)
    const minted = await L2_Contract.minted(depositHash)
    expect(minted).toEqual(true)
    const proxyToken = await L2_Contract.proxyTokenMap(BigInt(network.chainId).toString(), '0x0000000000000000000000000000000000000000')
    let proxyBalanceOfDepositor = await L2_Contract.balanceOf(proxyToken, owner.address)
    expect(amount).toEqual(proxyBalanceOfDepositor)
  })
  it('should deposit ERC20 on source chain and mint on target chain', async function () {
    const network = await provider.getNetwork()
    const L1_Chain = network.chainId
    const L2_Chain = 10101
    const amount = BigInt(1e+3)
    const {L2_Contract, depositHash, erc20} = await depositERC20OnL1(L1_Chain, L2_Chain, amount)
    await setTimeout(1000)
    const minted = await L2_Contract.minted(depositHash)
    expect(minted).toEqual(true)
    const proxyToken = await L2_Contract.proxyTokenMap(BigInt(network.chainId).toString(), erc20.target)
    const proxyBalanceOfDepositor = await L2_Contract.balanceOf(proxyToken, account1)
    expect(amount).toEqual(proxyBalanceOfDepositor)
  })

  it('should disburse when withdrawn from target chain', async function () {
    const network = await provider.getNetwork()
    const L1_Chain = network.chainId
    const L2_Chain = 10101
    const amount = BigInt(1e+19)
    let ethBalanceOfDepositor = await provider.getBalance(owner)
    console.log('******************b4 deposit*********', formatEther(ethBalanceOfDepositor.toString()))
    const {L2_Contract, leader} = await depositETHOnL1(L1_Chain, L2_Chain, amount)
    const proxyToken = await L2_Contract.proxyTokenMap(BigInt(network.chainId).toString(), '0x0000000000000000000000000000000000000000')
    let proxyBalanceOfDepositor = await L2_Contract.balanceOf(proxyToken, owner.address)
    expect(amount).toEqual(proxyBalanceOfDepositor)
    const withdrawReceipt = await L2_Contract.withdrawEth(L1_Chain, amount).then(tx => tx.wait())
    proxyBalanceOfDepositor = await L2_Contract.balanceOf(proxyToken, owner.address)
    expect(BigInt(0)).toEqual(proxyBalanceOfDepositor)
    ethBalanceOfDepositor = await provider.getBalance(owner)
    console.log('after deposit', formatEther(ethBalanceOfDepositor.toString()))
    const logs = await provider.getLogs(withdrawReceipt)
    for (const log of logs) {
      if (log.address == L2_Contract.target) await leader.processWithdraw(L2_Chain, log)
    }
    await setTimeout(1000)
    ethBalanceOfDepositor = await provider.getBalance(owner)
    console.log('after withdraw', formatEther(ethBalanceOfDepositor.toString()))
    /*
    L2: withdraw
         burn
         withdrawn(withdrawHash(account, token originating address, token originating chain, amount, withdrawCounter), true)
    L1: disburse
        check disbursed(withdrawHash) !== true
        transfer original token and amount to account
     */
  })
  it('should disburse ERC20 when proxy withdrawn from target chain', async function () {
    const network = await provider.getNetwork()
    const L1_Chain = network.chainId
    const L2_Chain = 10101
    const amount = BigInt(1e+3)
    const {L2_Contract, leader, depositHash, erc20} = await depositERC20OnL1(L1_Chain, L2_Chain, amount)
    await setTimeout(1000)
    const minted = await L2_Contract.minted(depositHash)
    expect(minted).toEqual(true)
    const proxyToken = await L2_Contract.proxyTokenMap(BigInt(L1_Chain).toString(), erc20.target)
    const proxyBalanceOfDepositor = await L2_Contract.balanceOf(proxyToken, account1)
    expect(amount).toEqual(proxyBalanceOfDepositor)
    const contractWithAccount1 = L2_Contract.connect(account1)
    let erc20Balance = await erc20.balanceOf(account1)
    expect(BigInt(erc20Balance)).toEqual(999999000n)
    const withdrawReceipt = await contractWithAccount1.withdrawToken(L1_Chain, erc20, amount).then(tx => tx.wait())
    const logs = await provider.getLogs(withdrawReceipt)
    for (const log of logs) {
      if (log.address == L2_Contract.target) await leader.processWithdraw(L2_Chain, log)
    }
    await setTimeout(1000)
    erc20Balance = await erc20.balanceOf(account1)
    expect(BigInt(erc20Balance)).toEqual(1000000000n)
    /*
    L2: withdraw
         burn
         withdrawn(withdrawHash(account, token originating address, token originating chain, amount, withdrawCounter), true)
    L1: disburse
        check disbursed(withdrawHash) !== true
        transfer original token and amount to account
     */
  })
  it('should mint when withdrawn from target chain to not an originating chain', async function () {
    /*
    L2: withdraw
         burn
         withdrawn(withdrawHash(account, token originating address, token originating chain, amount, withdrawCounter), true)
    L3: mint
        check minted(withdrawHash) !== true
        mint token to account
     */
  })
  it.skip('should mint token using fixture data', async function () {
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
      vaultUser: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      tokenAddress: '0x0000000000000000000000000000000000000000',
      decimals: 18n,
      toChainId: 10101n,
      amount: 1000000n,
      depositCounter: 0n
    }
    const contract = await createVault(network.chainId, fixture.pubkey_ser)
    const name = 'PROXY_NAME' //fixme this can be 'constant' or derived from the original token. ultimately, it's always the address that's the unique/primary key
    const symbol = 'PROXY_SYMBOL'
    await contract.mint(fixture.sig_ser, fixture.pubkey_ser, abi.encode(['address', 'address', 'uint', 'uint', 'uint', 'uint', 'uint', 'string', 'string'], [fixture.vaultUser, fixture.tokenAddress, BigInt(fixture.decimals), BigInt(network.chainId), BigInt(fixture.toChainId), BigInt(fixture.amount), BigInt(fixture.depositCounter), name, symbol]))
    await setTimeout(1000)
    const depositHash = keccak256(fixture.vaultUser, fixture.tokenAddress, BigInt(fixture.decimals).toString(), BigInt(fixture.toChainId).toString(), BigInt(fixture.amount).toString(), BigInt(fixture.depositCounter).toString())
    const minted = await contract.minted(depositHash)
    expect(minted).toEqual(true)
    const proxyToken = await contract.proxyTokenMap(BigInt(network.chainId).toString(), fixture.tokenAddress)
    const proxyBalanceOfDepositor = await contract.balanceOf(proxyToken, fixture.vaultUser)
    expect(fixture.amount).toEqual(proxyBalanceOfDepositor)

  })

})