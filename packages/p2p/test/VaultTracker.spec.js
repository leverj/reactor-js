import {ETH} from '@leverj/common/utils'
import {encodeTransfer} from '@leverj/reactor.chain/contracts'
import {
  chainId,
  getContractAt,
  getSigners,
  provider,
  publicKey,
  signedBy,
  signer,
  Vault,
} from '@leverj/reactor.chain/test'
import config from 'config'
import {expect} from 'expect'
import {rmSync} from 'node:fs'
import {setTimeout} from 'node:timers/promises'
import {VaultTracker} from '../src/VaultTracker.js'
import {KeyvJsonStore} from '../src/utils/index.js'

const [, account] = await getSigners()
const {bridgeNode: {confDir}, chain: {polling}} = config

describe('VaultTracker', () => {
  const amount = 1000n
  const fromChainId = chainId, toChainId = 98989n
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
    const store = new KeyvJsonStore(confDir, 'TrackerMarker')
    tracker = await VaultTracker(store, fromChainId, fromVault, polling, node)
    await tracker.start()
  })
  afterEach(() => {
    tracker.stop()
    tracker.store.clear()
  })
  after(() => rmSync(confDir, {recursive: true, force: true}))

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
