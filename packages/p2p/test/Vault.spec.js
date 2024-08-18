import {ETH, logger} from '@leverj/common/utils'
import {ERC20, ERC20Proxy, getContractAt, getSigners, provider, Vault} from '@leverj/reactor.chain/test'
import {deserializeHexStrToPublicKey, G2ToNumbers} from '@leverj/reactor.mcl'
import {expect} from 'expect'
import {setTimeout} from 'node:timers/promises'
import {createBridgeNodes} from './help/setup.js'

const [, account] = await getSigners()

describe('Vault', () => {
  const L1 = 10101n, L2 = 98989n, amount = 1000n
  let nodes, leader

  beforeEach(async () => {
    nodes = await createBridgeNodes(7)
    leader = nodes[0]
    await leader.publishWhitelist()
    await leader.startDKG(4)
    await setTimeout(100)
  })
  afterEach(async () => { for (let each of nodes) await each.stop() })

  const deployVaultPerChainOnNodes = async (chains) => {
    const publicKey = G2ToNumbers(deserializeHexStrToPublicKey(leader.groupPublicKey.serializeToHexStr()))
    const vaults = []
    for (let each of chains) {
      const vault = await Vault(each, publicKey)
      vaults.push(vault)
      nodes.forEach(_ => _.setVaultForChain(each, vault))
    }
    return vaults
  }

  const checkOutNativeFromTo = async (fromVault, toVault, amount) => checkOutFromTo(fromVault, toVault, amount)
  const checkOutTokenFromTo = async (fromVault, toVault, amount, token) => checkOutFromTo(fromVault, toVault, amount, token)
  const checkOutFromTo = async (fromVault, toVault, amount, token) => {
    if (token) await token.connect(account).approve(fromVault.target, amount).then(_ => _.wait())
    const to = await toVault.chainId()
    const receipt = token ?
      await fromVault.connect(account).checkOutToken(to, token.target, amount).then(_ => _.wait()) :
      await fromVault.connect(account).checkOutNative(to, {value: amount}).then(_ => _.wait())
    await processTransfer(receipt, fromVault)
    await setTimeout(100)
  }

  const processTransfer = async (receipt, vault) => {
    for (let each of await provider.getLogs(receipt)) if (each.address === vault.target) await leader.processTransfer(each)
    await setTimeout(10)
  }

  describe('should disburse currency when transferred from originating chain', () => {
    let fromVault, toVault

    beforeEach(async () => [fromVault, toVault] = await deployVaultPerChainOnNodes([L1, L2]))

    it('Native', async () => {
      const before = await provider.getBalance(account)
      logger.log('>>> before', before)
      await checkOutNativeFromTo(fromVault, toVault, amount)
      const proxy = await getContractAt('ERC20Proxy', await toVault.proxies(L1, ETH))
      expect(await proxy.balanceOf(account.address)).toEqual(amount)
      // expect(await provider.getBalance(account)).toEqual(before - amount)

      const receipt = await toVault.connect(account).checkOutToken(L1, proxy.target, amount).then(_ => _.wait())
      expect(await proxy.balanceOf(account.address)).toEqual(0n)

      await processTransfer(receipt, toVault)
      // expect(await provider.getBalance(account)).toEqual(before) //fixme: need to set gas price to 0
      logger.log('<<< after', await provider.getBalance(account))
    })

    it('Token', async () => {
      const balance = amount * 10n
      const erc20 = await ERC20()
      await erc20.mint(account.address, balance)
      await erc20.connect(account).approve(fromVault.target, amount).then(_ => _.wait())
      const before = await erc20.balanceOf(account.address)
      await checkOutTokenFromTo(fromVault, toVault, amount, erc20)
      const proxy = await getContractAt('ERC20Proxy', await toVault.proxies(L1, erc20.target))
      expect(await proxy.balanceOf(account.address)).toEqual(amount)
      expect(await erc20.balanceOf(account.address)).toEqual(balance - amount)

      const receipt = await toVault.connect(account).checkOutToken(L1, proxy.target, amount).then(_ => _.wait())
      expect(await proxy.balanceOf(account.address)).toEqual(0n)

      await processTransfer(receipt, toVault)
      expect(await erc20.balanceOf(account.address)).toEqual(before)
    })
  })

  describe('multi-chain scenarios with currency transfer on first chain', () => {
    const chains = [1, 2, 3, 4, 5, 6, 7]
    let vaults

    beforeEach(async () => vaults = await deployVaultPerChainOnNodes(chains))

    it('Native', async () => {
      const before = await provider.getBalance(account)
      logger.log('>>> before', before)
      const receipt = await vaults[0].connect(account).checkOutNative(chains[1], {value: amount}).then(_ => _.wait())
      await processTransfer(receipt, vaults[0])
      const proxies = {}
      for (let i = 1; i < chains.length; i++) {
        const proxyAddress = await vaults[i].proxies(chains[0], ETH)
        proxies[chains[i]] = await getContractAt('ERC20Proxy', proxyAddress)
        expect(await proxies[chains[i]].balanceOf(account.address)).toEqual(amount)

        const targetChainIndex = (i === chains.length - 1) ? 0 : (i + 1)
        const targetChain = chains[targetChainIndex]
        const receipt = await vaults[i].connect(account).checkOutToken(targetChain, proxyAddress, amount).then(_ => _.wait())
        await processTransfer(receipt, vaults[i])
        expect(await proxies[chains[i]].balanceOf(account.address)).toEqual(0n)
      }
      // expect(before).toEqual(await provider.getBalance(account)) //fixme: need to set gas price to 0
      logger.log('<<< after', await provider.getBalance(account))
    })

    it('Native - proxy', async () => {
      const proxy = await ERC20Proxy(1, ETH, 'ETHER', 'ETH', 18)
      await proxy.mint(account.address, amount)
      await proxy.connect(account).approve(vaults[0].target, amount).then(_ => _.wait())
      const before = await proxy.balanceOf(account.address)
      const receipt = await vaults[0].connect(account).checkOutToken(chains[1], proxy.target, amount).then(_ => _.wait())
      await processTransfer(receipt, vaults[0])
      const proxies = {}
      for (let i = 1; i < chains.length; i++) {
        const proxyAddress = await vaults[i].proxies(chains[0], proxy.target)
        proxies[chains[i]] = await getContractAt('ERC20Proxy', proxyAddress)
        expect(await proxies[chains[i]].balanceOf(account.address)).toEqual(amount)

        const targetChainIndex = (i === chains.length - 1) ? 0 : (i + 1)
        const targetChain = chains[targetChainIndex]
        const receipt = await vaults[i].connect(account).checkOutToken(targetChain, proxyAddress, amount).then(_ => _.wait())
        await processTransfer(receipt, vaults[i])
        expect(await proxies[chains[i]].balanceOf(account.address)).toEqual(0n)
      }
      for (let each of chains) if (proxies[each]) expect(await proxies[each].balanceOf(account.address)).toEqual(0n)
      expect(await proxy.balanceOf(account.address)).toEqual(amount)
    })
  })
})
