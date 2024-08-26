import {ETH} from '@leverj/common/utils'
import {encodeTransfer} from '@leverj/reactor.chain/contracts'
import {evm, getContractAt, getSigners, provider, Vault} from '@leverj/reactor.chain/test'
import {VaultTracker} from '@leverj/reactor.chain/tracking'
import {expect} from 'expect'
import {setTimeout} from 'node:timers/promises'
import {InMemoryStore, publicKey, signedBy, signer} from '../help.js'

const [, account] = await getSigners()

describe('VaultTracker', () => {
  const amount = 1000n
  const fromChainId = evm.chainId, toChainId = 98989n
  let fromVault, toVault, tracker

  beforeEach(async () => {
    fromVault = await Vault(fromChainId, publicKey), toVault = await Vault(toChainId, publicKey)
    const polling = {interval: 10, attempts: 5}
    const node = {
      processTransfer: async _ => {
        const {transferHash, origin, token, name, symbol, decimals, amount, owner, from, to, tag} = _
        const payload = encodeTransfer(origin, token, name, symbol, decimals, amount, owner, from, to, tag)
        const signature = signedBy(transferHash, signer)
        await toVault.checkIn(signature, publicKey, payload).then(_ => _.wait())
      }
    }
    tracker = VaultTracker(new InMemoryStore(), evm.chainId, fromVault, polling, node)
    await tracker.start()
  })
  afterEach(() => {
    tracker.stop()
    tracker.marker.store.clear()
  })

  it('should respond on Transfer event', async () => {
    const before = await provider.getBalance(account)
    await fromVault.connect(account).checkOutNative(toChainId, {value: amount}).then(_ => _.wait())
    const afterCheckingOut = await provider.getBalance(account)
    expect(afterCheckingOut).toEqual(before - amount)

    await setTimeout(100)
    const proxyAddress = await toVault.proxies(fromChainId, ETH)
    const proxy = await getContractAt('ERC20Proxy', proxyAddress)
    expect(await proxy.balanceOf(account.address)).toEqual(amount)
  })
})
