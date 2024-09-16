import {accounts, ETH, getContractAt, provider} from '@leverj/chain-deployment/test'
import {InMemoryStore, logger} from '@leverj/common'
import {encodeTransfer} from '@leverj/reactor.chain/contracts'
import {publicKey, signedBy, signer, Vault} from '@leverj/reactor.chain/test'
import {expect} from 'expect'
import {setTimeout} from 'node:timers/promises'
import {VaultTracker} from '../src/CrossChainVaultCoordinator.js'
import config from '../config.js'

describe('VaultTracker', () => {
  const [, account] = accounts
  const fromChainId = 10101n, toChainId = 98989n, amount = 1_000_000n
  let fromVault, toVault, tracker

  beforeEach(async () => {
    fromVault = await Vault(fromChainId, publicKey), toVault = await Vault(toChainId, publicKey)
    const onEvent = async (event) => {
      switch (event.name) {
        case 'Transfer':
          const {transferHash, origin, token, name, symbol, decimals, amount, owner, from, to, tag} = event.args
          const payload = encodeTransfer(origin, token, name, symbol, decimals, amount, owner, from, to, tag)
          const signature = signedBy(transferHash, signer)
          await toVault.checkIn(signature, publicKey, payload).then(_ => _.wait())
      }
    }
    tracker = VaultTracker(config, fromChainId, fromVault, new InMemoryStore(), {onEvent}, logger)
    await tracker.start()
  })

  afterEach(async () => tracker.stop())

  it('acts on a Transfer event', async () => {
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
})
