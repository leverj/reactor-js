import {ETH} from '@leverj/common/utils'
import * as chain from '@leverj/reactor.chain/contracts'
import {G1ToNumbers, G2ToNumbers, newKeyPair, sign} from '@leverj/reactor.mcl'
import {Interface} from 'ethers'
import {expect} from 'expect'
import {ERC20, getContractAt, getSigners, provider, Vault} from './help/index.js'

const [, account] = await getSigners()
const iface = new Interface(chain.abi.Vault.abi)
const Transfer = iface.getEvent('Transfer').topicHash
const getTransferEvent = async () => provider.getLogs({topics: [Transfer]}).then(_ => iface.parseLog(_[0]).args)

describe('Vault', () => {
  const signer = newKeyPair()
  const publicKey = G2ToNumbers(signer.pubkey)
  const fromChainId = 10101n, toChainId = 98989n
  const deposit = 1000n

  describe('checkOut', () => {
    it('Native', async () => {
      const vault = await Vault(fromChainId, publicKey)
      const [chainId, chainName, nativeSymbol, nativeDecimals] = await vault.home()
      await vault.connect(account).checkOutNative(toChainId, {value: deposit}).then(_ => _.wait())
      const {hash, origin, token, name, symbol, decimals, amount, owner, from, to, tag} = await getTransferEvent()
      expect(chainId).toEqual(origin)
      expect(await vault.NATIVE()).toEqual(token)
      expect(chainName).toEqual(name)
      expect(nativeSymbol).toEqual(symbol)
      expect(nativeDecimals).toEqual(decimals)
      expect(deposit).toEqual(amount)
      expect(account.address).toEqual(owner)
      expect(chainId).toEqual(from)
      expect(toChainId).toEqual(to)
      expect(await vault.checkoutCounter()).toEqual(tag)
      expect(await vault.checkouts(hash)).toEqual(true)
    })

    it('Token', async () => {
      const vault = await Vault(fromChainId, publicKey)
      const erc20 = await ERC20()
      await erc20.mint(account.address, deposit)
      await erc20.connect(account).approve(vault.target, deposit).then(_ => _.wait())

      await vault.connect(account).checkOutToken(toChainId, erc20.target, deposit).then(_ => _.wait())
      const {hash, origin, token, name, symbol, decimals, amount, owner, from, to, tag} = await getTransferEvent()
      expect(fromChainId).toEqual(origin)
      expect(erc20.target).toEqual(token)
      expect(await erc20.name()).toEqual(name)
      expect(await erc20.symbol()).toEqual(symbol)
      expect(await erc20.decimals()).toEqual(decimals)
      expect(deposit).toEqual(amount)
      expect(account.address).toEqual(owner)
      expect(fromChainId).toEqual(from)
      expect(toChainId).toEqual(to)
      expect(await vault.checkoutCounter()).toEqual(tag)
      expect(await vault.checkouts(hash)).toEqual(true)
    })
  })

  describe('checkIn', () => {
    it('Native', async () => {
      const fromVault = await Vault(fromChainId, publicKey), toVault = await Vault(toChainId, publicKey)
      await fromVault.connect(account).checkOutNative(toChainId, {value: deposit}).then(_ => _.wait())
      const {hash, origin, token, name, symbol, decimals, amount, owner, from, to, tag} = await getTransferEvent()
      expect(fromChainId).toEqual(origin)

      expect(await toVault.checkins(hash)).toEqual(false)
      const signature = G1ToNumbers(sign(hash, signer.secret).signature)
      const payload = chain.encodeTransfer(origin, token, name, symbol, decimals, amount, owner, from, to, tag)
      await toVault.checkIn(signature, publicKey, payload).then(_ => _.wait())
      expect(await toVault.checkins(hash)).toEqual(true)

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
      const {hash, origin, token, name, symbol, decimals, amount, owner, from, to, tag} = await getTransferEvent()
      expect(fromChainId).toEqual(origin)

      expect(await toVault.checkins(hash)).toEqual(false)
      const signature = G1ToNumbers(sign(hash, signer.secret).signature)
      const payload = chain.encodeTransfer(origin, token, name, symbol, decimals, amount, owner, from, to, tag)
      await toVault.checkIn(signature, publicKey, payload).then(_ => _.wait())
      expect(await toVault.checkins(hash)).toEqual(true)

      const proxyAddress = await toVault.proxies(fromChainId, erc20.target)
      const proxy = await getContractAt('ERC20Proxy', proxyAddress)
      expect(amount).toEqual(await proxy.balanceOf(owner))
      expect(await toVault.isCheckedIn(proxyAddress)).toEqual(true)
    })
  })
})
