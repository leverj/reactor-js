import {logger} from '@leverj/common/utils'
import {ERC20, ERC20Proxy, getContractAt, getSigners, provider, Vault} from '@leverj/reactor.chain/test'
import {deserializeHexStrToPublicKey, G2ToNumbers} from '@leverj/reactor.mcl'
import {formatEther} from 'ethers'
import {expect} from 'expect'
import {setTimeout} from 'node:timers/promises'
import {BridgeNode} from '../src/BridgeNode.js'
import {Deposit} from '../src/Deposit.js'
import {peerIdJsons} from './help/fixtures.js'

const [owner, account] = await getSigners()

describe('Vault', () => {
  let nodes, leader

  const createBridgeNodes = async (howMany) => {
    const bootstraps = []
    for (let i = 0; i < howMany; i++) {
      const node = await BridgeNode.from({
        port: 9000 + i,
        isLeader: i === 0,
        json: {p2p: peerIdJsons[i]},
        bootstrapNodes: bootstraps,
      })
      await node.start()
      const deposit = new Deposit(node)
      node.setDeposit(deposit)
      nodes.push(deposit)
      if (i === 0) bootstraps.push(node.multiaddrs[0])
    }
    leader = nodes[0]
  }

  const deployVaultContractPerChainsOnNodes = async (chains, nodes) => {
    await leader.bridgeNode.publishWhitelist()
    await leader.bridgeNode.startDKG(4)
    await setTimeout(10)
    const pubkey_ser = G2ToNumbers(deserializeHexStrToPublicKey(leader.bridgeNode.tss.groupPublicKey.serializeToHexStr()))
    const contracts = []
    for (let chain of chains) {
      const contract = await Vault(chain, pubkey_ser)
      contracts.push(contract)
      nodes.forEach(_ => _.setContract(chain, contract))
    }
    return contracts
  }

  const sendNativeFromL1 = async (chains, amount) => {
    const [L1, L2] = chains
    await createBridgeNodes(7)
    const [L1_Contract, L2_Contract] = await deployVaultContractPerChainsOnNodes(chains, nodes)
    const logs = await provider.getLogs(await L1_Contract.sendNative(L2, {value: amount}).then(tx => tx.wait()))
    let depositHash
    for (let each of logs) {
      depositHash = await leader.processTokenSent(each)
      await setTimeout(100)
    }
    return {L2_Contract, depositHash}
  }

  const sendTokenFromL1 = async (chains, amount) => {
    const [L1, L2] = chains
    await createBridgeNodes(7)
    const [L1_Contract, L2_Contract] = await deployVaultContractPerChainsOnNodes(chains, nodes)
    const erc20 = await ERC20('USD_TETHER', 'USDT')
    await erc20.mint(account, 1e9)
    await erc20.connect(account).approve(L1_Contract.target, 1000000, {from: account.address}).then(tx => tx.wait())
    const logs = await provider.getLogs(await L1_Contract.connect(account).sendToken(L2, erc20.target, amount).then(tx => tx.wait()))
    const depositHash = await leader.processTokenSent(logs[1]) // fixme: why the difference from sendNative?
    return {L2_Contract, depositHash, erc20}
  }

  beforeEach(() => nodes = [])
  afterEach(async () => { for (let each of nodes) await each.bridgeNode.stop() })

  it('should invoke Deposit workflow on receipt of message', async () => {
    const network = await provider.getNetwork()
    const L1_Chain = network.chainId
    const L2_Chain = 10101
    const amount = BigInt(1e+19)
    const {L2_Contract, depositHash} = await sendNativeFromL1([L1_Chain, L2_Chain], amount)
    const minted = await L2_Contract.tokenArrived(depositHash)
    expect(minted).toEqual(true)

    const proxyAddress = await L2_Contract.proxyMapping(network.chainId, '0x0000000000000000000000000000000000000000')
    const proxy = await getContractAt('ERC20Proxy', proxyAddress)
    const proxyBalanceOfDepositor = await proxy.balanceOf(owner.address)
    expect(amount).toEqual(proxyBalanceOfDepositor)

    const isProxy = await L2_Contract.isProxy(proxyAddress)
    expect(isProxy).toEqual(true)
    expect(await proxy.name()).toEqual('ETHER')
    expect(await proxy.symbol()).toEqual('ETH')
  })

  it('should deposit ERC20 on source chain and mint on target chain', async () => {
    const network = await provider.getNetwork()
    const L1_Chain = network.chainId
    const L2_Chain = 10101
    const amount = 1000n
    const {L2_Contract, depositHash, erc20} = await sendTokenFromL1([L1_Chain, L2_Chain], amount)
    await setTimeout(100)
    const minted = await L2_Contract.tokenArrived(depositHash)
    expect(minted).toEqual(true)

    const proxyToken = await L2_Contract.proxyMapping(network.chainId, erc20.target)
    const proxy = await getContractAt('ERC20Proxy', proxyToken)
    const proxyBalanceOfDepositor = await proxy.balanceOf(account)
    expect(amount).toEqual(proxyBalanceOfDepositor)

    const proxyName = await proxy.name()
    const proxySymbol = await proxy.symbol()
    expect(proxyName).toEqual('USD_TETHER')
    expect(proxySymbol).toEqual('USDT')
  })

  it('should disburse when withdrawn from target chain', async () => {
    const network = await provider.getNetwork()
    const L1_Chain = network.chainId
    const L2_Chain = 10101
    const amount = BigInt(1e+19)
    let ethBalanceOfDepositor = await provider.getBalance(owner)
    logger.log('******************b4 deposit*********', formatEther(ethBalanceOfDepositor.toString()))
    const {L2_Contract} = await sendNativeFromL1([L1_Chain, L2_Chain], amount)
    const proxyToken = await L2_Contract.proxyMapping(network.chainId, '0x0000000000000000000000000000000000000000')
    const proxy = await getContractAt('ERC20Proxy', proxyToken)
    let proxyBalanceOfDepositor = await proxy.balanceOf(owner.address)
    expect(amount).toEqual(proxyBalanceOfDepositor)

    const withdrawReceipt = await L2_Contract.sendToken(L1_Chain, proxyToken, amount).then(tx => tx.wait())
    proxyBalanceOfDepositor = await proxy.balanceOf(owner.address)
    expect(0n).toEqual(proxyBalanceOfDepositor)

    ethBalanceOfDepositor = await provider.getBalance(owner)
    logger.log('after deposit', formatEther(ethBalanceOfDepositor.toString()))
    for (let each of await provider.getLogs(withdrawReceipt)) {
      if (each.address === L2_Contract.target) await leader.processTokenSent(each)
    }
    await setTimeout(10)
    ethBalanceOfDepositor = await provider.getBalance(owner)
    // fixme: need to test ETH balance
    logger.log('after withdraw', formatEther(ethBalanceOfDepositor.toString()))
  })

  it('should disburse ERC20 when proxy withdrawn from target chain', async () => {
    const network = await provider.getNetwork()
    const L1_Chain = network.chainId
    const L2_Chain = 10101
    const amount = 1000n
    const {L2_Contract, depositHash, erc20} = await sendTokenFromL1([L1_Chain, L2_Chain], amount)
    await setTimeout(100)
    const minted = await L2_Contract.tokenArrived(depositHash)
    expect(minted).toEqual(true)

    const proxyToken = await L2_Contract.proxyMapping(L1_Chain, erc20.target)
    const proxy = await getContractAt('ERC20Proxy', proxyToken)
    const proxyBalanceOfDepositor = await proxy.balanceOf(account)
    expect(amount).toEqual(proxyBalanceOfDepositor)

    const contractWithAccount1 = L2_Contract.connect(account)
    expect(await erc20.balanceOf(account)).toEqual(999999000n)

    logger.log('Get Contract for', proxyToken)
    logger.log('Instantiated token', proxy)
    logger.log('Approve for', L2_Contract.target)
    await proxy.approve(L2_Contract.target, amount)
    const withdrawReceipt = await contractWithAccount1.sendToken(L1_Chain, proxyToken, amount).then(tx => tx.wait())
    for (let each of await provider.getLogs(withdrawReceipt)) {
      if (each.address === L2_Contract.target) await leader.processTokenSent(each)
    }
    await setTimeout(100)
    expect(await erc20.balanceOf(account)).toEqual(1000000000n)
  })

  it('multi-chain scenarios with ETH deposit on first chain', async () => {
    const chains = [33333, 10101, 10102, 10103, 10104, 10105]
    const amount = BigInt(1e+19)
    await createBridgeNodes(7)
    const contracts = await deployVaultContractPerChainsOnNodes(chains, nodes)

    let ethBalanceOfDepositor = await provider.getBalance(owner)
    logger.log('b4 deposit', formatEther(ethBalanceOfDepositor))
    const balanceBeforeDeposit = ethBalanceOfDepositor
    const txnReceipt = await contracts[0].sendNative(chains[1], {value: amount}).then(tx => tx.wait())
    let tokenSentHash
    for (let each of await provider.getLogs(txnReceipt)) {
      tokenSentHash = await leader.processTokenSent(each)
      await setTimeout(10)
    }
    let proxyMapping = {}
    for (let i = 1; i < chains.length; i++) {
      ethBalanceOfDepositor = await provider.getBalance(owner)
      const isEthCloseToOriginalAmount = formatEther(ethBalanceOfDepositor.toString()).startsWith('9999.9')
      logger.log('isEthCloseToOriginalAmount', isEthCloseToOriginalAmount)
      expect(isEthCloseToOriginalAmount).toEqual(false)

      const proxyToken = await contracts[i].proxyMapping(chains[0], '0x0000000000000000000000000000000000000000')
      const proxy = await getContractAt('ERC20Proxy', proxyToken)
      const proxyName = await proxy.name()
      const proxySymbol = await proxy.symbol()
      expect(proxyName).toEqual('ETHER')
      expect(proxySymbol).toEqual('ETH')

      proxyMapping[chains[i]] = proxy
      let proxyBalance = await proxyMapping[chains[i]].balanceOf(owner)
      expect(proxyBalance).toEqual(amount)

      const targetChainIdx = (i === chains.length - 1) ? 0 : (i + 1)
      const targetChain = chains[targetChainIdx]
      const withdrawReceipt = await contracts[i].sendToken(targetChain, proxyToken, amount).then(tx => tx.wait())
      for (let each of await provider.getLogs(withdrawReceipt)) {
        if (each.address === contracts[i].target) await leader.processTokenSent(each)
      }
      await setTimeout(10)
      proxyBalance = await proxyMapping[chains[i]].balanceOf(owner)
      logger.log('Proxy Balance after transfer', chains[i], proxyBalance)
      expect(proxyBalance).toEqual(0n)
    }

    ethBalanceOfDepositor = await provider.getBalance(owner)
    logger.log('after withdraw', formatEther(ethBalanceOfDepositor.toString()))
    // fixme: because of Gas consumption and due to all chains being simulated in one place, final ETH will be different.
    // This is approximation test for now, but can be made precise by having exact gas calculation. Ok for time being
    const delta = balanceBeforeDeposit - ethBalanceOfDepositor
    logger.log('DELTA', delta, formatEther(delta).toString())
    const isEthCloseToOriginalAmount = formatEther(delta).toString().startsWith('0.00')
    expect(isEthCloseToOriginalAmount).toEqual(true)
  })

  it('multi-chain scenarios with ERC20 deposit on first chain', async () => {
    const chains = [33333, 10101, 10102, 10103, 10104]
    await createBridgeNodes(7)
    const contracts = await deployVaultContractPerChainsOnNodes(chains, nodes)
    const proxy = await ERC20Proxy('L2Test', 'L2Test', 12, '0x0000000000000000000000000000000000000000', 1)
    await proxy.mint(owner, 1e3)
    logger.log('erc20Balance init', await proxy.balanceOf(owner))
    await proxy.approve(contracts[0].target, 1000000).then(_ => _.wait())
    const amount = 1000n
    const txnReceipt = await contracts[0].sendToken(chains[1], proxy.target, amount).then(tx => tx.wait())
    logger.log('erc20Balance after deposit', await proxy.balanceOf(owner))
    expect(await proxy.balanceOf(owner)).toEqual(0n)

    const logs = await provider.getLogs(txnReceipt)
    await leader.processTokenSent(logs[1])
    await setTimeout(100)
    const proxyMapping = {}
    for (let i = 1; i < chains.length; i++) {
      const proxyToken = await contracts[i].proxyMapping(chains[0], proxy.target)
      proxyMapping[chains[i]] = await getContractAt('ERC20Proxy', proxyToken)
      let proxyBalance = await proxyMapping[chains[i]].balanceOf(owner)
      logger.log('Proxy Balance b4 transfer', chains[i], proxyBalance)
      expect(proxyBalance).toEqual(amount)

      const targetChainIdx = (i === chains.length - 1) ? 0 : (i + 1)
      const targetChain = chains[targetChainIdx]
      logger.log('Send Token from ', i, targetChainIdx, targetChain)
      const withdrawReceipt = await contracts[i].sendToken(targetChain, proxyToken, amount).then(tx => tx.wait())
      for (let each of await provider.getLogs(withdrawReceipt)) {
        if (each.address === contracts[i].target) await leader.processTokenSent(each)
      }
      await setTimeout(10)
      proxyBalance = await proxyMapping[chains[i]].balanceOf(owner)
      logger.log('Proxy Balance after transfer', chains[i], proxyBalance)
      expect(proxyBalance).toEqual(0n)
    }
    for (let each of chains) {
      if (proxyMapping[each]) {
        const proxyBalance = await proxyMapping[each].balanceOf(owner)
        expect(proxyBalance).toEqual(0n)
      }
    }
    logger.log('erc20Balance', await proxy.balanceOf(owner))
    expect(await proxy.balanceOf(owner)).toEqual(amount)
  })
})
