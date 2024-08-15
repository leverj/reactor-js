import {ETH, logger} from '@leverj/common/utils'
import {ERC20, ERC20Proxy, getContractAt, getSigners, provider, Vault} from '@leverj/reactor.chain/test'
import {deserializeHexStrToPublicKey, G2ToNumbers} from '@leverj/reactor.mcl'
import {formatEther} from 'ethers'
import {expect} from 'expect'
import {setTimeout} from 'node:timers/promises'
import {createBridgeNodes} from './help/setup.js'

const [owner, account] = await getSigners()
const network = await provider.getNetwork()
const L1 = network.chainId, L2 = 10101, amount = 1000n

describe('Vault', () => {
  let nodes, leader

  beforeEach(() => nodes = [])
  afterEach(async () => { for (let each of nodes) await each.stop() })

  const deployVaultPerChainOnNodes = async (chains) => {
    await leader.publishWhitelist()
    await leader.startDKG(4)
    await setTimeout(10)
    const publicKey = G2ToNumbers(deserializeHexStrToPublicKey(leader.groupPublicKey.serializeToHexStr()))
    const vaults = []
    for (let each of chains) {
      const vault = await Vault(each, publicKey)
      vaults.push(vault)
      nodes.forEach(_ => _.setVaultForChain(each, vault))
    }
    return vaults
  }

  const checkOutNativeFromTo = async (from, to, amount) => checkOutFromTo(from, to, amount)
  const checkOutTokenFromTo = async (from, to, amount) => {
    const token = await ERC20('USD_TETHER', 'USDT')
    await token.mint(account, 1e+9)
    return checkOutFromTo(from, to, amount, token)
  }
  const checkOutFromTo = async (from, to, amount, token) => {
    nodes = await createBridgeNodes(7), leader = nodes[0]
    const [fromVault, toVault] = await deployVaultPerChainOnNodes([from, to])
    if (token) await token.connect(account).approve(fromVault.target, amount, {from: account.address}).then(_ => _.wait())
    const log = token ?
      await provider.getLogs(await fromVault.connect(account).checkOutToken(to, token.target, amount).then(_ => _.wait())).then(_ => _[1]) :
      await provider.getLogs(await fromVault.checkOutNative(to, {value: amount}).then(_ => _.wait())).then(_ => _[0])
    const transferHash = await leader.processTransfer(log)
    await setTimeout(100)
    return {toVault, transferHash, token}
  }

  it('should disburse when withdrawn from target chain', async () => {
    const before = await provider.getBalance(owner)
    const {toVault, transferHash} = await checkOutNativeFromTo(L1, L2, amount)
    expect(await toVault.inTransfers(transferHash)).toEqual(true)

    const proxyAddress = await toVault.proxies(L1, ETH)
    const proxy = await getContractAt('ERC20Proxy', proxyAddress)
    expect(amount).toEqual(await proxy.balanceOf(owner.address))
    expect(await toVault.isCheckedIn(proxyAddress)).toEqual(true)

    const receipt = await toVault.checkOutToken(L1, proxyAddress, amount).then(_ => _.wait())
    expect(0n).toEqual(await proxy.balanceOf(owner.address))
    const log = await provider.getLogs(receipt).then(_ => _[1])
    await leader.processTransfer(log)
    await setTimeout(10)
    // fixme: make gas price 0 and test ETH balance
    // const after = await provider.getBalance(owner)
    // expect(before).toEqual(after)
  })
  //fixme: same as above
  it.skip('should invoke Transfer workflow on receipt of message', async () => {
    const {toVault, transferHash} = await checkOutNativeFromTo(L1, L2, amount)
    expect(await toVault.inTransfers(transferHash)).toEqual(true)

    const proxyAddress = await toVault.proxies(L1, ETH)
    const proxy = await getContractAt('ERC20Proxy', proxyAddress)
    expect(amount).toEqual(await proxy.balanceOf(owner.address))
    expect(await toVault.isCheckedIn(proxyAddress)).toEqual(true)

    // // fixme: ERC20Proxy test
    // expect(await proxy.name()).toEqual('ETHER')
    // expect(await proxy.symbol()).toEqual('ETH')
  })

  it('should disburse ERC20 when proxy withdrawn from target chain', async () => {
    const {toVault, transferHash, token} = await checkOutTokenFromTo(L1, L2, amount)
    expect(await toVault.inTransfers(transferHash)).toEqual(true)

    const proxyAddress = await toVault.proxies(L1, token.target)
    const proxy = await getContractAt('ERC20Proxy', proxyAddress)
    expect(amount).toEqual(await proxy.balanceOf(account))
    expect(await token.balanceOf(account)).toEqual(999999000n) //fixme: await token.supply() - amount

    await proxy.approve(toVault.target, amount)
    const withdrawReceipt = await toVault.connect(account).checkOutToken(L1, proxyAddress, amount).then(_ => _.wait())
    for (let each of await provider.getLogs(withdrawReceipt)) if (each.address === toVault.target) await leader.processTransfer(each)
    await setTimeout(100)
    expect(await token.balanceOf(account)).toEqual(1000000000n)
  })
  //fixme: same as above
  it.skip('should transfer ERC20 on source chain and mint on target chain', async () => {
    const {toVault, transferHash, token} = await checkOutTokenFromTo(L1, L2, amount)
    expect(await toVault.inTransfers(transferHash)).toEqual(true)

    const proxyAddress = await toVault.proxies(L1, token.target)
    const proxy = await getContractAt('ERC20Proxy', proxyAddress)
    const proxyBalanceOfTransferer = await proxy.balanceOf(account)
    expect(amount).toEqual(proxyBalanceOfTransferer)

    // // fixme: ERC20Proxy test
    // const proxyName = await proxy.name()
    // const proxySymbol = await proxy.symbol()
    // expect(proxyName).toEqual('USD_TETHER')
    // expect(proxySymbol).toEqual('USDT')
  })

  it('multi-chain scenarios with ETH transfer on first chain', async () => {
    const chains = [33333, 10101, 10102, 10103, 10104, 10105], amount = BigInt(1e+19)
    nodes = await createBridgeNodes(7), leader = nodes[0]
    const contracts = await deployVaultPerChainOnNodes(chains)
    const balanceBeforeTransfer = await provider.getBalance(owner)
    logger.log('b4 transfer', formatEther(balanceBeforeTransfer))
    const txnReceipt = await contracts[0].checkOutNative(chains[1], {value: amount}).then(_ => _.wait())
    let tokenTransferHash
    for (let each of await provider.getLogs(txnReceipt)) {
      tokenTransferHash = await leader.processTransfer(each)
      await setTimeout(10)
    }
    let proxies = {}
    for (let i = 1; i < chains.length; i++) {
      const ethBalanceOfTransferer = await provider.getBalance(owner)
      expect(formatEther(ethBalanceOfTransferer.toString()).startsWith('9999.9')).toEqual(false)

      const proxyToken = await contracts[i].proxies(chains[0], ETH)
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

    const balanceAfterTransfer = await provider.getBalance(owner)
    logger.log('after withdraw', formatEther(balanceAfterTransfer.toString()))
    // fixme: because of Gas consumption and due to all chains being simulated in one place, final ETH will be different.
    // This is approximation test for now, but can be made precise by having exact gas calculation. Ok for time being
    // fixme: gas cost is now 0
    const delta = balanceBeforeTransfer - balanceAfterTransfer
    logger.log('DELTA', delta, formatEther(delta).toString())
    const isEthCloseToOriginalAmount = formatEther(delta).toString().startsWith('0.00')
    expect(isEthCloseToOriginalAmount).toEqual(true)
  })

  it('multi-chain scenarios with ERC20 transfer on first chain', async () => {
    const chains = [33333, 10101, 10102, 10103, 10104], amount = 1000n
    nodes = await createBridgeNodes(7), leader = nodes[0]
    const contracts = await deployVaultPerChainOnNodes(chains)
    const proxy = await ERC20Proxy('L2Test', 'L2Test', 12, ETH, 1)
    await proxy.mint(owner, 1e+3)
    logger.log('erc20Balance init', await proxy.balanceOf(owner))
    await proxy.approve(contracts[0].target, 1000000).then(_ => _.wait())
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
