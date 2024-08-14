import {logger} from '@leverj/common/utils'
import {ERC20, ERC20Proxy, getContractAt, getSigners, provider, Vault} from '@leverj/reactor.chain/test'
import {deserializeHexStrToPublicKey, G2ToNumbers} from '@leverj/reactor.mcl'
import {formatEther} from 'ethers'
import {expect} from 'expect'
import {setTimeout} from 'node:timers/promises'
import {BridgeNode} from '../src/BridgeNode.js'
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
      nodes.push(node)
      if (i === 0) bootstraps.push(node.multiaddrs[0])
    }
    leader = nodes[0]
  }

  const deployVaultContractPerChainsOnNodes = async (chains, nodes) => {
    await leader.publishWhitelist()
    await leader.startDKG(4)
    await setTimeout(10)
    const pubkey_ser = G2ToNumbers(deserializeHexStrToPublicKey(leader.groupPublicKey.serializeToHexStr()))
    const contracts = []
    for (let chain of chains) {
      const contract = await Vault(chain, pubkey_ser)
      contracts.push(contract)
      nodes.forEach(_ => _.setVaultForChain(chain, contract))
    }
    return contracts
  }

  const checkOutNativeFromL1 = async (chains, amount) => {
    const [L1, L2] = chains
    await createBridgeNodes(7)
    const [L1_Contract, L2_Contract] = await deployVaultContractPerChainsOnNodes(chains, nodes)
    const logs = await provider.getLogs(await L1_Contract.checkOutNative(L2, {value: amount}).then(_ => _.wait()))
    let transferHash
    for (let each of logs) {
      transferHash = await leader.processTransfer(each)
      await setTimeout(100)
    }
    return {L2_Contract, transferHash}
  }

  const checkOutTokenFromL1 = async (chains, amount) => {
    const [L1, L2] = chains
    await createBridgeNodes(7)
    const [L1_Contract, L2_Contract] = await deployVaultContractPerChainsOnNodes(chains, nodes)
    const erc20 = await ERC20('USD_TETHER', 'USDT')
    await erc20.mint(account, 1e9)
    await erc20.connect(account).approve(L1_Contract.target, 1000000, {from: account.address}).then(_ => _.wait())
    const logs = await provider.getLogs(await L1_Contract.connect(account).checkOutToken(L2, erc20.target, amount).then(_ => _.wait()))
    const transferHash = await leader.processTransfer(logs[1]) // fixme: why the difference from checkOutNative?
    return {L2_Contract, transferHash, erc20}
  }

  beforeEach(() => nodes = [])
  afterEach(async () => { for (let each of nodes) await each.stop() })

  it('should invoke Transfer workflow on receipt of message', async () => {
    const network = await provider.getNetwork()
    const L1_Chain = network.chainId
    const L2_Chain = 10101
    const amount = BigInt(1e+19)
    const {L2_Contract, transferHash} = await checkOutNativeFromL1([L1_Chain, L2_Chain], amount)
    const minted = await L2_Contract.inTransfers(transferHash)
    expect(minted).toEqual(true)

    const proxyAddress = await L2_Contract.proxies(network.chainId, '0x0000000000000000000000000000000000000000')
    const proxy = await getContractAt('ERC20Proxy', proxyAddress)
    const proxyBalanceOfTransferer = await proxy.balanceOf(owner.address)
    expect(amount).toEqual(proxyBalanceOfTransferer)

    const isCheckedIn = await L2_Contract.isCheckedIn(proxyAddress)
    expect(isCheckedIn).toEqual(true)
    expect(await proxy.name()).toEqual('ETHER')
    expect(await proxy.symbol()).toEqual('ETH')
  })

  it('should transfer ERC20 on source chain and mint on target chain', async () => {
    const network = await provider.getNetwork()
    const L1_Chain = network.chainId
    const L2_Chain = 10101
    const amount = 1000n
    const {L2_Contract, transferHash, erc20} = await checkOutTokenFromL1([L1_Chain, L2_Chain], amount)
    await setTimeout(100)
    const minted = await L2_Contract.inTransfers(transferHash)
    expect(minted).toEqual(true)

    const proxyToken = await L2_Contract.proxies(network.chainId, erc20.target)
    const proxy = await getContractAt('ERC20Proxy', proxyToken)
    const proxyBalanceOfTransferer = await proxy.balanceOf(account)
    expect(amount).toEqual(proxyBalanceOfTransferer)

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
    let ethBalanceOfTransferer = await provider.getBalance(owner)
    logger.log('******************b4 transfer*********', formatEther(ethBalanceOfTransferer.toString()))
    const {L2_Contract} = await checkOutNativeFromL1([L1_Chain, L2_Chain], amount)
    const proxyToken = await L2_Contract.proxies(network.chainId, '0x0000000000000000000000000000000000000000')
    const proxy = await getContractAt('ERC20Proxy', proxyToken)
    let proxyBalanceOfTransferer = await proxy.balanceOf(owner.address)
    expect(amount).toEqual(proxyBalanceOfTransferer)

    const withdrawReceipt = await L2_Contract.checkOutToken(L1_Chain, proxyToken, amount).then(_ => _.wait())
    proxyBalanceOfTransferer = await proxy.balanceOf(owner.address)
    expect(0n).toEqual(proxyBalanceOfTransferer)

    ethBalanceOfTransferer = await provider.getBalance(owner)
    logger.log('after transfer', formatEther(ethBalanceOfTransferer.toString()))
    for (let each of await provider.getLogs(withdrawReceipt)) {
      if (each.address === L2_Contract.target) await leader.processTransfer(each)
    }
    await setTimeout(10)
    ethBalanceOfTransferer = await provider.getBalance(owner)
    // fixme: need to test ETH balance
    logger.log('after withdraw', formatEther(ethBalanceOfTransferer.toString()))
  })

  it('should disburse ERC20 when proxy withdrawn from target chain', async () => {
    const network = await provider.getNetwork()
    const L1_Chain = network.chainId
    const L2_Chain = 10101
    const amount = 1000n
    const {L2_Contract, transferHash, erc20} = await checkOutTokenFromL1([L1_Chain, L2_Chain], amount)
    await setTimeout(100)
    const minted = await L2_Contract.inTransfers(transferHash)
    expect(minted).toEqual(true)

    const proxyToken = await L2_Contract.proxies(L1_Chain, erc20.target)
    const proxy = await getContractAt('ERC20Proxy', proxyToken)
    const proxyBalanceOfTransferer = await proxy.balanceOf(account)
    expect(amount).toEqual(proxyBalanceOfTransferer)

    const contractWithAccount1 = L2_Contract.connect(account)
    expect(await erc20.balanceOf(account)).toEqual(999999000n)

    logger.log('Get Contract for', proxyToken)
    logger.log('Instantiated token', proxy)
    logger.log('Approve for', L2_Contract.target)
    await proxy.approve(L2_Contract.target, amount)
    const withdrawReceipt = await contractWithAccount1.checkOutToken(L1_Chain, proxyToken, amount).then(_ => _.wait())
    for (let each of await provider.getLogs(withdrawReceipt)) {
      if (each.address === L2_Contract.target) await leader.processTransfer(each)
    }
    await setTimeout(100)
    expect(await erc20.balanceOf(account)).toEqual(1000000000n)
  })

  it('multi-chain scenarios with ETH transfer on first chain', async () => {
    const chains = [33333, 10101, 10102, 10103, 10104, 10105]
    const amount = BigInt(1e+19)
    await createBridgeNodes(7)
    const contracts = await deployVaultContractPerChainsOnNodes(chains, nodes)

    let ethBalanceOfTransferer = await provider.getBalance(owner)
    logger.log('b4 transfer', formatEther(ethBalanceOfTransferer))
    const balanceBeforeTransfer = ethBalanceOfTransferer
    const txnReceipt = await contracts[0].checkOutNative(chains[1], {value: amount}).then(_ => _.wait())
    let tokenTransferHash
    for (let each of await provider.getLogs(txnReceipt)) {
      tokenTransferHash = await leader.processTransfer(each)
      await setTimeout(10)
    }
    let proxies = {}
    for (let i = 1; i < chains.length; i++) {
      ethBalanceOfTransferer = await provider.getBalance(owner)
      const isEthCloseToOriginalAmount = formatEther(ethBalanceOfTransferer.toString()).startsWith('9999.9')
      logger.log('isEthCloseToOriginalAmount', isEthCloseToOriginalAmount)
      expect(isEthCloseToOriginalAmount).toEqual(false)

      const proxyToken = await contracts[i].proxies(chains[0], '0x0000000000000000000000000000000000000000')
      const proxy = await getContractAt('ERC20Proxy', proxyToken)
      const proxyName = await proxy.name()
      const proxySymbol = await proxy.symbol()
      expect(proxyName).toEqual('ETHER')
      expect(proxySymbol).toEqual('ETH')

      proxies[chains[i]] = proxy
      let proxyBalance = await proxies[chains[i]].balanceOf(owner)
      expect(proxyBalance).toEqual(amount)

      const targetChainIdx = (i === chains.length - 1) ? 0 : (i + 1)
      const targetChain = chains[targetChainIdx]
      const withdrawReceipt = await contracts[i].checkOutToken(targetChain, proxyToken, amount).then(_ => _.wait())
      for (let each of await provider.getLogs(withdrawReceipt)) {
        if (each.address === contracts[i].target) await leader.processTransfer(each)
      }
      await setTimeout(10)
      proxyBalance = await proxies[chains[i]].balanceOf(owner)
      logger.log('Proxy Balance after transfer', chains[i], proxyBalance)
      expect(proxyBalance).toEqual(0n)
    }

    ethBalanceOfTransferer = await provider.getBalance(owner)
    logger.log('after withdraw', formatEther(ethBalanceOfTransferer.toString()))
    // fixme: because of Gas consumption and due to all chains being simulated in one place, final ETH will be different.
    // This is approximation test for now, but can be made precise by having exact gas calculation. Ok for time being
    // fixme: gas cost is now 0
    const delta = balanceBeforeTransfer - ethBalanceOfTransferer
    logger.log('DELTA', delta, formatEther(delta).toString())
    const isEthCloseToOriginalAmount = formatEther(delta).toString().startsWith('0.00')
    expect(isEthCloseToOriginalAmount).toEqual(true)
  })

  it('multi-chain scenarios with ERC20 transfer on first chain', async () => {
    const chains = [33333, 10101, 10102, 10103, 10104]
    await createBridgeNodes(7)
    const contracts = await deployVaultContractPerChainsOnNodes(chains, nodes)
    const proxy = await ERC20Proxy('L2Test', 'L2Test', 12, '0x0000000000000000000000000000000000000000', 1)
    await proxy.mint(owner, 1e3)
    logger.log('erc20Balance init', await proxy.balanceOf(owner))
    await proxy.approve(contracts[0].target, 1000000).then(_ => _.wait())
    const amount = 1000n
    const txnReceipt = await contracts[0].checkOutToken(chains[1], proxy.target, amount).then(_ => _.wait())
    logger.log('erc20Balance after transfer', await proxy.balanceOf(owner))
    expect(await proxy.balanceOf(owner)).toEqual(0n)

    const logs = await provider.getLogs(txnReceipt)
    await leader.processTransfer(logs[1])
    await setTimeout(100)
    const proxies = {}
    for (let i = 1; i < chains.length; i++) {
      const proxyToken = await contracts[i].proxies(chains[0], proxy.target)
      proxies[chains[i]] = await getContractAt('ERC20Proxy', proxyToken)
      let proxyBalance = await proxies[chains[i]].balanceOf(owner)
      logger.log('Proxy Balance b4 transfer', chains[i], proxyBalance)
      expect(proxyBalance).toEqual(amount)

      const targetChainIdx = (i === chains.length - 1) ? 0 : (i + 1)
      const targetChain = chains[targetChainIdx]
      logger.log('Send Token from ', i, targetChainIdx, targetChain)
      const withdrawReceipt = await contracts[i].checkOutToken(targetChain, proxyToken, amount).then(_ => _.wait())
      for (let each of await provider.getLogs(withdrawReceipt)) {
        if (each.address === contracts[i].target) await leader.processTransfer(each)
      }
      await setTimeout(10)
      proxyBalance = await proxies[chains[i]].balanceOf(owner)
      logger.log('Proxy Balance after transfer', chains[i], proxyBalance)
      expect(proxyBalance).toEqual(0n)
    }
    for (let each of chains) {
      if (proxies[each]) {
        const proxyBalance = await proxies[each].balanceOf(owner)
        expect(proxyBalance).toEqual(0n)
      }
    }
    logger.log('erc20Balance', await proxy.balanceOf(owner))
    expect(await proxy.balanceOf(owner)).toEqual(amount)
  })
})
