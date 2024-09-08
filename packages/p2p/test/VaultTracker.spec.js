import {InMemoryStore} from '@leverj/common'
import {encodeTransfer} from '@leverj/reactor.chain/contracts'
import {
  accounts,
  ETH,
  getContractAt,
  provider,
  publicKey,
  signedBy,
  signer,
  Vault,
  ZeroAddress,
} from '@leverj/reactor.chain/test'
import {expect} from 'expect'
import {setTimeout} from 'node:timers/promises'
import config from '../config.js'
import {VaultTracker} from '../src/VaultTracker.js'

const {chain: {polling}} = config

describe('VaultTracker', () => {
  const [, account] = accounts
  const fromChainId = 10101n, toChainId = 98989n, amount = 1000n
  let fromVault, toVault, tracker

  beforeEach(async () => {
    fromVault = await Vault(fromChainId, publicKey), toVault = await Vault(toChainId, publicKey)
    const node = {
      processTransfer: async _ => {
        const {transferHash, origin, token, name, symbol, decimals, amount, owner, from, to, tag} = _
        const payload = encodeTransfer(origin, token, name, symbol, decimals, amount, owner, from, to, tag)
        const signature = signedBy(transferHash, signer)
        await toVault.checkIn(signature, publicKey, payload).then(_ => _.wait())
      }
    }
    tracker = await VaultTracker(new InMemoryStore(), fromVault, polling, node)
    await tracker.start()
  })
  afterEach(async () => tracker.stop())

  it('should respond on Transfer event', async () => {
    const before = await provider.getBalance(account)
    await fromVault.connect(account).checkOutNative(toChainId, {value: amount}).then(_ => _.wait())
    const afterCheckingOut = await provider.getBalance(account)
    expect(afterCheckingOut).toEqual(before - amount)

    await setTimeout(200)
    const proxyAddress = await toVault.proxies(fromChainId, ETH)
    expect(proxyAddress).not.toEqual(ZeroAddress)
    const proxy = await getContractAt('ERC20Proxy', proxyAddress)
    expect(await proxy.balanceOf(account.address)).toEqual(amount)
  })
})
