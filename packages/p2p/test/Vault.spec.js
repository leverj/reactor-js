import {logger} from '@leverj/common/utils'
import {deserializeHexStrToG2, g2ToBN} from '@leverj/reactor.mcl'
import {AbiCoder, formatEther, keccak256} from 'ethers'
import {expect} from 'expect'
import {setTimeout} from 'node:timers/promises'
import {BridgeNode} from '../src/BridgeNode.js'
import {SendToken} from '../src/SendToken.js'
import {deployContract, getContractAt, getSigners, provider} from './help/hardhat.js'
import {peerIdJsons} from './help/index.js'

const [owner, account1] = await getSigners()

describe('Vault', () => {
  const nodes = []

  const stopBridgeNodes = async () => {
    for (const deposit of nodes) await deposit.bridgeNode.stop()
    nodes.length = 0
  }

  const createDepositNodes = async (count) => {
    const bootstraps = []
    for (let i = 0; i < count; i++) {
      const node = new BridgeNode({
        port: 9000 + i,
        isLeader: i === 0,
        json: {p2p: peerIdJsons[i]},
        bootstrapNodes: bootstraps,
      })
      await node.create()
      const deposit = new SendToken(node)
      node.setDeposit(deposit)
      nodes.push(deposit)
      if (i === 0) bootstraps.push(node.multiaddrs[0])
    }
    return nodes
  }

  const _setContractsOnNodes = async (chains, [leader, node1, node2, node3, node4, node5, node6]) => {
    await leader.bridgeNode.publishWhitelist()
    await leader.bridgeNode.startDKG(4)
    await setTimeout(1000)
    const pubkeyHex = leader.bridgeNode.tssNode.groupPublicKey.serializeToHexStr()
    const pubkey = deserializeHexStrToG2(pubkeyHex)
    const pubkey_ser = g2ToBN(pubkey)
    const contracts = []
    for (const chain of chains) {
      const contract = await createVault(chain, pubkey_ser)
      contracts.push(contract)
      for (const node of [leader, node1, node2, node3, node4, node5, node6]) {
        node.setContract(chain, contract)
      }
    }
    return contracts
  }

  const sendoutETHFromL1 = async (chains, amount) => {
    const [leader, node1, node2, node3, node4, node5, node6] = await createDepositNodes(7)
    const [L1_Contract, L2_Contract] = await _setContractsOnNodes(chains, [leader, node1, node2, node3, node4, node5, node6])
    const txnReceipt = await L1_Contract.sendNative(chains[1], {value: amount}).then(tx => tx.wait())
    const logs = await provider.getLogs(txnReceipt)
    let depositHash
    for (const log of logs) {
      depositHash = await leader.processTokenSent(log)
      await setTimeout(1000)
    }
    return {L2_Contract, leader, depositHash}
  }

  const sendoutERC20FromL1 = async (chains, amount) => {
    const [leader, node1, node2, node3, node4, node5, node6] = await createDepositNodes(7)
    const [L1_Contract, L2_Contract] = await _setContractsOnNodes(chains, [leader, node1, node2, node3, node4, node5, node6])
    const erc20 = await deployContract('ERC20Mock', ['USD_TETHER', 'USDT'])
    await erc20.mint(account1, 1e9)
    const erc20WithAccount1 = erc20.connect(account1)
    await erc20WithAccount1.approve(L1_Contract.target, 1000000, {from: account1.address}).then(tx => tx.wait())
    const contractWithAccount1 = L1_Contract.connect(account1)
    const txReceipt = await contractWithAccount1.sendToken(chains[1], erc20.target, amount).then(tx => tx.wait())
    const logs = await provider.getLogs(txReceipt)
    const depositHash = await leader.processTokenSent(logs[1])
    return {L2_Contract, leader, depositHash, erc20}
  }

  const createVault = async (chainId, pubkey_ser) => await deployContract('Vault', [chainId, pubkey_ser])

  afterEach(async () => await stopBridgeNodes())

  it('should invoke Deposit workflow on receipt of message', async () => {
    const network = await provider.getNetwork()
    const L1_Chain = network.chainId
    const L2_Chain = 10101
    const amount = BigInt(1e+19)
    const {L2_Contract, depositHash} = await sendoutETHFromL1([L1_Chain, L2_Chain], amount)
    const minted = await L2_Contract.tokenArrived(depositHash)
    expect(minted).toEqual(true)

    const proxyAddress = await L2_Contract.proxyMapping(BigInt(network.chainId).toString(), '0x0000000000000000000000000000000000000000')
    const proxy = await getContractAt('ERC20Proxy', proxyAddress)
    const proxyBalanceOfDepositor = await proxy.balanceOf(owner.address)
    expect(amount).toEqual(proxyBalanceOfDepositor)

    const isProxy = await L2_Contract.isProxyMapping(proxyAddress)
    expect(isProxy).toEqual(true)
    expect(await proxy.name()).toEqual('ETHER_REACTOR')
    expect(await proxy.symbol()).toEqual('ETH_R')
  })

  it('should deposit ERC20 on source chain and mint on target chain', async () => {
    const network = await provider.getNetwork()
    const L1_Chain = network.chainId
    const L2_Chain = 10101
    const amount = BigInt(1e+3)
    const {L2_Contract, depositHash, erc20} = await sendoutERC20FromL1([L1_Chain, L2_Chain], amount)
    await setTimeout(1000)
    const minted = await L2_Contract.tokenArrived(depositHash)
    expect(minted).toEqual(true)

    const proxyToken = await L2_Contract.proxyMapping(BigInt(network.chainId).toString(), erc20.target)
    const proxy = await getContractAt('ERC20Proxy', proxyToken)
    const proxyBalanceOfDepositor = await proxy.balanceOf(account1)
    expect(amount).toEqual(proxyBalanceOfDepositor)

    const proxyName = await proxy.name()
    const proxySymbol = await proxy.symbol()
    expect(proxyName).toEqual('USD_TETHER_REACTOR')
    expect(proxySymbol).toEqual('USDT_R')
  })

  it('should disburse when withdrawn from target chain', async () => {
    const network = await provider.getNetwork()
    const L1_Chain = network.chainId
    const L2_Chain = 10101
    const amount = BigInt(1e+19)
    let ethBalanceOfDepositor = await provider.getBalance(owner)
    logger.log('******************b4 deposit*********', formatEther(ethBalanceOfDepositor.toString()))
    const {L2_Contract, leader} = await sendoutETHFromL1([L1_Chain, L2_Chain], amount)
    const proxyToken = await L2_Contract.proxyMapping(BigInt(network.chainId).toString(), '0x0000000000000000000000000000000000000000')
    const proxy = await getContractAt('ERC20Proxy', proxyToken)
    let proxyBalanceOfDepositor = await proxy.balanceOf(owner.address)
    expect(amount).toEqual(proxyBalanceOfDepositor)

    const withdrawReceipt = await L2_Contract.sendToken(L1_Chain, proxyToken, amount).then(tx => tx.wait())
    proxyBalanceOfDepositor = await proxy.balanceOf(owner.address)
    expect(BigInt(0)).toEqual(proxyBalanceOfDepositor)

    ethBalanceOfDepositor = await provider.getBalance(owner)
    logger.log('after deposit', formatEther(ethBalanceOfDepositor.toString()))
    const logs = await provider.getLogs(withdrawReceipt)
    for (const log of logs) if (log.address === L2_Contract.target) await leader.processTokenSent(log)
    await setTimeout(1000)
    ethBalanceOfDepositor = await provider.getBalance(owner)
    //fixme: need to test ETH balance
    logger.log('after withdraw', formatEther(ethBalanceOfDepositor.toString()))
  })

  it('should disburse ERC20 when proxy withdrawn from target chain', async () => {
    const network = await provider.getNetwork()
    const L1_Chain = network.chainId
    const L2_Chain = 10101
    const amount = BigInt(1e+3)
    const {L2_Contract, leader, depositHash, erc20} = await sendoutERC20FromL1([L1_Chain, L2_Chain], amount)
    await setTimeout(1000)
    const minted = await L2_Contract.tokenArrived(depositHash)
    expect(minted).toEqual(true)

    const proxyToken = await L2_Contract.proxyMapping(BigInt(L1_Chain).toString(), erc20.target)
    const proxy = await getContractAt('ERC20Proxy', proxyToken)
    const proxyBalanceOfDepositor = await proxy.balanceOf(account1)
    expect(amount).toEqual(proxyBalanceOfDepositor)

    const contractWithAccount1 = L2_Contract.connect(account1)
    expect(BigInt(await erc20.balanceOf(account1))).toEqual(999999000n)

    logger.log('Get Contract for', proxyToken)
    logger.log('Instantiated token', proxy)
    logger.log('Approve for', L2_Contract.target)
    await proxy.approve(L2_Contract.target, amount)
    const withdrawReceipt = await contractWithAccount1.sendToken(L1_Chain, proxyToken, amount).then(tx => tx.wait())
    const logs = await provider.getLogs(withdrawReceipt)
    for (const log of logs) if (log.address == L2_Contract.target) await leader.processTokenSent(log)
    await setTimeout(1000)
    expect(BigInt(await erc20.balanceOf(account1))).toEqual(1000000000n)
  })

  it('multi-chain scenarios with ETH deposit on first chain', async () => {
    const chains = [33333, 10101, 10102, 10103, 10104, 10105]
    const amount = BigInt(1e+19)
    const [leader, node1, node2, node3, node4, node5, node6] = await createDepositNodes(7)
    const contracts = await _setContractsOnNodes(chains, [leader, node1, node2, node3, node4, node5, node6])

    let ethBalanceOfDepositor = await provider.getBalance(owner)
    logger.log('b4 deposit', formatEther(ethBalanceOfDepositor.toString()))
    const balanceBeforeDeposit = ethBalanceOfDepositor
    const txnReceipt = await contracts[0].sendNative(chains[1], {value: amount}).then(tx => tx.wait())
    let logs = await provider.getLogs(txnReceipt)
    let tokenSentHash
    for (const log of logs) {
      tokenSentHash = await leader.processTokenSent(log)
      await setTimeout(1000)
    }
    let proxyMapping = {}
    for (let c = 1; c < chains.length; c++) {
      ethBalanceOfDepositor = await provider.getBalance(owner)
      const isEthCloseToOriginalAmount = formatEther(ethBalanceOfDepositor.toString()).startsWith('9999.9')
      logger.log('isEthCloseToOriginalAmount', isEthCloseToOriginalAmount)
      expect(isEthCloseToOriginalAmount).toEqual(false)

      const proxyToken = await contracts[c].proxyMapping(BigInt(chains[0]).toString(), '0x0000000000000000000000000000000000000000')
      const proxy = await getContractAt('ERC20Proxy', proxyToken)
      const proxyName = await proxy.name()
      const proxySymbol = await proxy.symbol()
      expect(proxyName).toEqual('ETHER_REACTOR')
      expect(proxySymbol).toEqual('ETH_R')

      proxyMapping[chains[c]] = proxy
      let proxyBalance = await proxyMapping[chains[c]].balanceOf(owner)
      expect(proxyBalance).toEqual(BigInt(amount))

      const targetChainIdx = (c == chains.length - 1) ? 0 : (c + 1)
      const targetChain = chains[targetChainIdx]
      const withdrawReceipt = await contracts[c].sendToken(targetChain, proxyToken, amount).then(tx => tx.wait())
      logs = await provider.getLogs(withdrawReceipt)
      for (const log of logs) if (log.address == contracts[c].target) await leader.processTokenSent(log)
      await setTimeout(1000)
      proxyBalance = await proxyMapping[chains[c]].balanceOf(owner)
      logger.log('Proxy Balance after transfer', chains[c], proxyBalance)
      expect(proxyBalance).toEqual(BigInt(0))
    }

    ethBalanceOfDepositor = await provider.getBalance(owner)
    logger.log('after withdraw', formatEther(ethBalanceOfDepositor.toString()))
    //fixme: because of Gas consumption and due to all chains being simulated in one place, final ETH will be different.
    // This is approximation test for now, but can be made precise by having exact gas calculation. Ok for time being
    const delta = BigInt(balanceBeforeDeposit) - BigInt(ethBalanceOfDepositor)
    logger.log('DELTA', delta, formatEther(delta).toString())
    const isEthCloseToOriginalAmount = formatEther(delta).toString().startsWith('0.00')
    expect(isEthCloseToOriginalAmount).toEqual(true)
  })

  it('multi-chain scenarios with ERC20 deposit on first chain', async () => {
    const chains = [33333, 10101, 10102, 10103, 10104]
    const amount = BigInt(1e+3)
    const [leader, node1, node2, node3, node4, node5, node6] = await createDepositNodes(7)
    const contracts = await _setContractsOnNodes(chains, [leader, node1, node2, node3, node4, node5, node6])
    const erc20 = await deployContract('ERC20Proxy', ['L2Test', 'L2Test', 12, '0x0000000000000000000000000000000000000000', 1])
    await erc20.mint(owner, 1e3)
    let erc20Balance = await erc20.balanceOf(owner)
    logger.log('erc20Balance init', erc20Balance)
    await erc20.approve(contracts[0].target, 1000000).then(tx => tx.wait())
    const txnReceipt = await contracts[0].sendToken(chains[1], erc20.target, amount).then(tx => tx.wait())
    erc20Balance = await erc20.balanceOf(owner)
    logger.log('erc20Balance after deposit', erc20Balance)
    expect(erc20Balance).toEqual(BigInt(0))

    let logs = await provider.getLogs(txnReceipt)
    await leader.processTokenSent(logs[1])
    await setTimeout(1000)
    const proxyMapping = {}
    for (let c = 1; c < chains.length; c++) {
      const proxyToken = await contracts[c].proxyMapping(BigInt(chains[0]).toString(), erc20.target)
      const proxy = await getContractAt('ERC20Proxy', proxyToken)
      proxyMapping[chains[c]] = proxy
      let proxyBalance = await proxyMapping[chains[c]].balanceOf(owner)
      logger.log('Proxy Balance b4 transfer', chains[c], proxyBalance)
      expect(proxyBalance).toEqual(BigInt(amount))

      const targetChainIdx = (c == chains.length - 1) ? 0 : (c + 1)
      const targetChain = chains[targetChainIdx]
      logger.log('Send Token from ', c, targetChainIdx, targetChain)
      const withdrawReceipt = await contracts[c].sendToken(targetChain, proxyToken, amount).then(tx => tx.wait())
      logs = await provider.getLogs(withdrawReceipt)
      for (const log of logs) if (log.address == contracts[c].target) await leader.processTokenSent(log)
      await setTimeout(1000)
      proxyBalance = await proxyMapping[chains[c]].balanceOf(owner)
      logger.log('Proxy Balance after transfer', chains[c], proxyBalance)
      expect(proxyBalance).toEqual(BigInt(0))

    }
    for (const chain of chains) {
      if (proxyMapping[chain]) {
        const proxyBalance = await proxyMapping[chain].balanceOf(owner)
        expect(proxyBalance).toEqual(BigInt(0))
      }
    }
    erc20Balance = await erc20.balanceOf(owner)
    logger.log('erc20Balance', erc20Balance)
    expect(erc20Balance).toEqual(BigInt(amount))
  })

  it.skip('should mint token using fixture data', async () => {
    const network = await provider.getNetwork()
    const fixture = {
      sig_ser: [
        '17501379548414473118975493418296770409004790518587989275104077991423278766345',
        '10573459840926036933226410278548182531900093958496894445083855256191507622572',
      ],
      pubkey_ser: [
        '17952266123624120693867949189877327115939693121746953888788663343366186261263',
        '3625386958213971493190482798835911536597490696820041295198885612842303573644',
        '14209805107538060976447556508818330114663332071460618570948978043188559362801',
        '6106226559240500500676195643085343038285250451936828952647773685858315556632',
      ],
      vaultUser: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      token: '0x0000000000000000000000000000000000000000',
      decimals: 18n,
      toChainId: 10101n,
      amount: 1000000n,
      depositCounter: 0n,
    }
    const contract = await createVault(network.chainId, fixture.pubkey_ser)
    await contract.mint(fixture.sig_ser, fixture.pubkey_ser, AbiCoder.defaultAbiCoder().encode(
      ['address', 'address', 'uint', 'uint', 'uint', 'uint', 'uint', 'string', 'string'],
      [fixture.vaultUser, fixture.token, BigInt(fixture.decimals), BigInt(network.chainId), BigInt(fixture.toChainId), BigInt(fixture.amount), BigInt(fixture.depositCounter), 'PROXY_NAME', 'PROXY_SYMBOL']
    ))
    await setTimeout(1000)
    const depositHash = keccak256(fixture.vaultUser, fixture.token, BigInt(fixture.decimals), BigInt(fixture.toChainId), BigInt(fixture.amount), BigInt(fixture.depositCounter))
    const minted = await contract.minted(depositHash)
    expect(minted).toEqual(true)

    const proxyToken = await contract.proxyMapping(BigInt(network.chainId), fixture.token)
    const proxyBalanceOfDepositor = await contract.balanceOf(proxyToken, fixture.vaultUser)
    expect(fixture.amount).toEqual(proxyBalanceOfDepositor)
  })
})
