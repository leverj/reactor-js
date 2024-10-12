import {accounts, getContractAt, provider} from '@leverj/lever.chain-deployment/hardhat.help'
import {encodeTransfer} from '@leverj/reactor.chain/contracts'
import {ERC20, ERC20Proxy, Vault} from '@leverj/reactor.chain/test'
import config from '@leverj/reactor.p2p/config'
import {ZeroAddress as ETH} from 'ethers'
import {expect} from 'expect'
import {Map} from 'immutable'
import {setTimeout} from 'node:timers/promises'
import {Nodes} from './help/nodes.js'

describe('Vault', () => {
  const [, account] = accounts
  const L1 = 10101n, L2 = 98989n, amount = 1000n
  let nodes

  beforeEach(async () => nodes = await new Nodes(config).start())
  afterEach(async () => await nodes.stop())

  const deployVaultPerChainOnNodes = async (chains) => {
    const vaults = Map().asMutable()
    for (let chainId of chains) {
      const vault = await Vault(chainId, nodes.leader.publicKey)
      vaults.set(chainId, vault)
      nodes.addVaultToAllNodes(chainId, vault)
    }
    return vaults.valueSeq().toArray()
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
    then(async _ => {
      const event = vault.interface.parseLog(_[0])
      const {transferHash, origin, token, name, symbol, decimals, amount, owner, from, to, tag} = event.args
      const signature = await nodes.leader.sign(from, transferHash)
      const payload = encodeTransfer(origin, token, name, symbol, decimals, amount, owner, from, to, tag)
      const toContract = nodes.leader.vaults.get(to)
      return toContract.accept(signature, nodes.leader.publicKey, payload).then(_ => _.wait())
    }).
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
    const chains = [1, 2, 3, 4, 5, 6, 7].map(_ => BigInt(_))
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
