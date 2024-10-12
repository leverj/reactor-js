import {accounts, getContractAt, provider} from '@leverj/lever.chain-deployment/hardhat.help'
import {InMemoryStore} from '@leverj/lever.common'
import {encodeTransfer} from '@leverj/reactor.chain/contracts'
import {ERC20, publicKey, signedBy, signer, Vault} from '@leverj/reactor.chain/test'
import {VaultTracker} from '@leverj/reactor.p2p'
import config from '@leverj/reactor.p2p/config'
import {ZeroAddress as ETH} from 'ethers'
import {expect} from 'expect'
import {setTimeout} from 'node:timers/promises'

describe('VaultTracker', () => {
  const [, account] = accounts
  const fromChainId = 10101n, toChainId = 98989n, amount = 1000n
  let fromVault, toVault, tracker

  beforeEach(async () => {
    fromVault = await Vault(fromChainId, publicKey), toVault = await Vault(toChainId, publicKey)
    const onEvent = async (event) => {
      switch (event.name) {
        case 'Transfer':
          const {transferHash, origin, token, name, symbol, decimals, amount, owner, from, to, tag} = event.args
          const payload = encodeTransfer(origin, token, name, symbol, decimals, amount, owner, from, to, tag)
          const signature = signedBy(transferHash, signer)
          await toVault.accept(signature, publicKey, payload).then(_ => _.wait())
      }
    }
    tracker = VaultTracker(fromChainId, fromVault, new InMemoryStore(), config.chain.tracker.polling, {onEvent})
    await tracker.start()
  })

  afterEach(async () => tracker.stop())

  describe('detects & acts on a Transfer event', () => {
    it('Native', async () => {
      const before = await provider.getBalance(account)
      await fromVault.connect(account).sendNative(toChainId, {value: amount}).then(_ => _.wait())
      const afterCheckingOut = await provider.getBalance(account)
      expect(afterCheckingOut).toEqual(before - amount)

      await setTimeout(200)
      const proxyAddress = await toVault.proxies(fromChainId, ETH)
      expect(proxyAddress).not.toEqual(ETH)
      const proxy = await getContractAt('ERC20Proxy', proxyAddress)
      expect(await proxy.balanceOf(account.address)).toEqual(amount)
    })

    it('Token', async () => {
      const token = await ERC20('Gold', '💰')
      await token.mint(account.address, amount)
      await token.connect(account).approve(fromVault.target, amount).then(_ => _.wait())
      const before = await token.balanceOf(account.address)
      await fromVault.connect(account).sendToken(toChainId, token.target, amount).then(_ => _.wait())
      const afterCheckingOut = await token.balanceOf(account.address)
      expect(afterCheckingOut).toEqual(before - amount)

      await setTimeout(200)
      const proxyAddress = await toVault.proxies(fromChainId, token.target)
      expect(proxyAddress).not.toEqual(token.target)
      const proxy = await getContractAt('ERC20Proxy', proxyAddress)
      expect(await proxy.balanceOf(account.address)).toEqual(amount)
    })
  })
})
