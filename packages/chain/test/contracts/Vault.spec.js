import {ETH} from '@leverj/common'
import {abi, encodeTransfer, events} from '@leverj/reactor.chain/contracts'
import {accounts, ERC20, getContractAt, provider, publicKey, signedBy, signer, Vault} from '@leverj/reactor.chain/test'
import {Interface} from 'ethers'
import {expect} from 'expect'

const iface = new Interface(abi.Vault.abi)
const topics = [events.Vault.Transfer.topic]
const getTransferEvent = async () => provider.getLogs({topics}).then(_ => iface.parseLog(_[0]).args)

describe('Vault', () => {
  const [, account] = accounts
  const fromChainId = 10101n, toChainId = 98989n, deposit = 1000n

  describe('checkOut', () => {
    it('Native', async () => {
      const vault = await Vault(fromChainId, publicKey)
      const [chainId, chainName, nativeSymbol, nativeDecimals] = await vault.home(), NATIVE = await vault.NATIVE()
      await vault.connect(account).checkOutNative(toChainId, {value: deposit}).then(_ => _.wait())
      const {transferHash, origin, token, name, symbol, decimals, amount, owner, from, to, tag} = await getTransferEvent()
      expect(origin).toEqual(chainId)
      expect(token).toEqual(NATIVE)
      expect(name).toEqual(chainName)
      expect(symbol).toEqual(nativeSymbol)
      expect(decimals).toEqual(nativeDecimals)
      expect(amount).toEqual(deposit)
      expect(owner).toEqual(account.address)
      expect(from).toEqual(chainId)
      expect(to).toEqual(toChainId)
      expect(tag).toEqual(await vault.checkoutCounter())
      expect(await vault.checkouts(transferHash)).toEqual(true)
    })

    it('Token', async () => {
      const vault = await Vault(fromChainId, publicKey)
      const erc20 = await ERC20()
      await erc20.mint(account.address, deposit)
      await erc20.connect(account).approve(vault.target, deposit).then(_ => _.wait())

      await vault.connect(account).checkOutToken(toChainId, erc20.target, deposit).then(_ => _.wait())
      const {transferHash, origin, token, name, symbol, decimals, amount, owner, from, to, tag} = await getTransferEvent()
      expect(origin).toEqual(fromChainId)
      expect(token).toEqual(erc20.target)
      expect(name).toEqual(await erc20.name())
      expect(symbol).toEqual(await erc20.symbol())
      expect(decimals).toEqual(await erc20.decimals())
      expect(amount).toEqual(deposit)
      expect(owner).toEqual(account.address)
      expect(from).toEqual(fromChainId)
      expect(to).toEqual(toChainId)
      expect(tag).toEqual(await vault.checkoutCounter())
      expect(await vault.checkouts(transferHash)).toEqual(true)
    })
  })

  describe('checkIn', () => {
    it('Native', async () => {
      const fromVault = await Vault(fromChainId, publicKey), toVault = await Vault(toChainId, publicKey)
      await fromVault.connect(account).checkOutNative(toChainId, {value: deposit}).then(_ => _.wait())
      const {transferHash, origin, token, name, symbol, decimals, amount, owner, from, to, tag} = await getTransferEvent()
      expect(origin).toEqual(fromChainId)

      expect(await toVault.checkins(transferHash)).toEqual(false)
      const signature = signedBy(transferHash, signer)
      const payload = encodeTransfer(origin, token, name, symbol, decimals, amount, owner, from, to, tag)
      await toVault.checkIn(signature, publicKey, payload).then(_ => _.wait())
      expect(await toVault.checkins(transferHash)).toEqual(true)

      const proxyAddress = await toVault.proxies(fromChainId, ETH)
      const proxy = await getContractAt('ERC20Proxy', proxyAddress)
      expect(amount).toEqual(await proxy.balanceOf(owner))
      expect(await toVault.isCheckedIn(proxyAddress)).toEqual(true)
    })

    it('Token', async () => {
      const fromVault = await Vault(fromChainId, publicKey), toVault = await Vault(toChainId, publicKey)
      const erc20 = await ERC20()
      await erc20.mint(account.address, deposit)
      await erc20.connect(account).approve(fromVault.target, deposit).then(_ => _.wait())
      await fromVault.connect(account).checkOutToken(toChainId, erc20.target, deposit).then(_ => _.wait())
      const {transferHash, origin, token, name, symbol, decimals, amount, owner, from, to, tag} = await getTransferEvent()
      expect(origin).toEqual(fromChainId)

      expect(await toVault.checkins(transferHash)).toEqual(false)
      const signature = signedBy(transferHash, signer)
      const payload = encodeTransfer(origin, token, name, symbol, decimals, amount, owner, from, to, tag)
      await toVault.checkIn(signature, publicKey, payload).then(_ => _.wait())
      expect(await toVault.checkins(transferHash)).toEqual(true)

      const proxyAddress = await toVault.proxies(fromChainId, erc20.target)
      const proxy = await getContractAt('ERC20Proxy', proxyAddress)
      expect(await proxy.balanceOf(owner)).toEqual(amount)
      expect(await toVault.isCheckedIn(proxyAddress)).toEqual(true)
    })
  })
})
