import {accounts, ETH, getContractAt, provider} from '@leverj/chain-deployment/test'
import {ERC20, ERC20Proxy, Vault} from '@leverj/reactor.chain/test'
import {expect} from 'expect'
import {setTimeout} from 'node:timers/promises'
import {createBridgeNodes} from './help/bridge.js'

describe('Vault', () => {
  const [, account] = accounts
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
    const publicKey = leader.publicKey
    const vaults = []
    for (let each of chains) {
      const vault = await Vault(each, publicKey)
      vaults.push(vault)
      nodes.forEach(_ => _.setVaultForChain(each, vault))
    }
    return vaults
  }

  const sendNativeFromTo = async (fromVault, toVault, amount) => sendFromTo(fromVault, toVault, amount)
  const sendTokenFromTo = async (fromVault, toVault, amount, token) => sendFromTo(fromVault, toVault, amount, token)
  const sendFromTo = async (fromVault, toVault, amount, token) => {
    if (token) await token.connect(account).approve(fromVault.target, amount).then(_ => _.wait())
    const to = await toVault.chainId()
    token ?
      await fromVault.connect(account).sendToken(to, token.target, amount).then(_ => _.wait()) :
      await fromVault.connect(account).sendNative(to, {value: amount}).then(_ => _.wait())
    await onEvent(fromVault)
  }

  const onEvent = async (vault) => vault.queryFilter('Transfer').
    then(_ => leader.onVaultEvent(vault.interface.parseLog(_[0]))).
    then(_ => setTimeout(100))

  describe('should disburse currency when transferred from originating chain', () => {
    let fromVault, toVault

    beforeEach(async () => [fromVault, toVault] = await deployVaultPerChainOnNodes([L1, L2]))

    it('Native', async () => {
      const before = await provider.getBalance(account)
      await sendNativeFromTo(fromVault, toVault, amount)
      const proxy = await getContractAt('ERC20Proxy', await toVault.proxies(L1, ETH))
      expect(await proxy.balanceOf(account.address)).toEqual(amount)
      expect(await provider.getBalance(account)).toEqual(before - amount)

      await toVault.connect(account).sendToken(L1, proxy.target, amount).then(_ => _.wait())
      expect(await proxy.balanceOf(account.address)).toEqual(0n)

      await onEvent(toVault)
      expect(await provider.getBalance(account)).toEqual(before)
    })

    it('Token', async () => {
      const balance = amount * 10n
      const token = await ERC20()
      await token.mint(account.address, balance)
      await token.connect(account).approve(fromVault.target, amount).then(_ => _.wait())
      const before = await token.balanceOf(account.address)
      await sendTokenFromTo(fromVault, toVault, amount, token)
      const proxy = await getContractAt('ERC20Proxy', await toVault.proxies(L1, token.target))
      expect(await proxy.balanceOf(account.address)).toEqual(amount)
      expect(await token.balanceOf(account.address)).toEqual(balance - amount)

      await toVault.connect(account).sendToken(L1, proxy.target, amount).then(_ => _.wait())
      expect(await proxy.balanceOf(account.address)).toEqual(0n)

      await onEvent(toVault)
      expect(await token.balanceOf(account.address)).toEqual(before)
    })
  })

  describe('multi-chain scenarios with currency transfer on first chain', () => {
    const chains = [1, 2, 3, 4, 5, 6, 7]
    let vaults

    beforeEach(async () => vaults = await deployVaultPerChainOnNodes(chains))

    it('Native', async () => {
      const before = await provider.getBalance(account)
      await vaults[0].connect(account).sendNative(chains[1], {value: amount}).then(_ => _.wait())
      await onEvent(vaults[0])
      const proxies = {}
      for (let i = 1; i < chains.length; i++) {
        const proxyAddress = await vaults[i].proxies(chains[0], ETH)
        expect(proxyAddress).not.toEqual(ETH)

        proxies[chains[i]] = await getContractAt('ERC20Proxy', proxyAddress)
        expect(await proxies[chains[i]].balanceOf(account.address)).toEqual(amount)

        const targetChainIndex = (i === chains.length - 1) ? 0 : (i + 1)
        const targetChain = chains[targetChainIndex]
        await vaults[i].connect(account).sendToken(targetChain, proxyAddress, amount).then(_ => _.wait())
        await onEvent(vaults[i])
        expect(await proxies[chains[i]].balanceOf(account.address)).toEqual(0n)
      }
      expect(before).toEqual(await provider.getBalance(account))
    })
  })
})
