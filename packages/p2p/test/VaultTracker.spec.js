import {ETH} from '@leverj/common/utils'
import {encodeTransfer} from '@leverj/reactor.chain/contracts'
import {evm, getContractAt, getSigners, provider, Vault} from '@leverj/reactor.chain/test'
import {VaultTracker} from '@leverj/reactor.chain/tracking'
import config from 'config'
import {expect} from 'expect'
import {rmSync} from 'node:fs'
import {setTimeout} from 'node:timers/promises'
import {newTrackerMarker, publicKey, signedBy, signer} from './help.js'

const [, account] = await getSigners()
const {bridgeNode: {confDir}, chain: {polling}} = config

describe.skip('VaultTracker', () => {
  const amount = 1000n
  const fromChainId = evm.chainId, toChainId = 98989n
  let fromVault, toVault, tracker

  beforeEach(async () => {
    fromVault = await Vault(fromChainId, publicKey), toVault = await Vault(toChainId, publicKey)
    const marker = newTrackerMarker(fromChainId)
    const node = {
      processTransfer: async _ => {
        const {hash, origin, token, name, symbol, decimals, amount, owner, from, to, tag} = _
        const payload = encodeTransfer(origin, token, name, symbol, decimals, amount, owner, from, to, tag)
        const signature = signedBy(hash, signer)
        await toVault.checkIn(signature, publicKey, payload).then(_ => _.wait())
      }
    }
    tracker = await VaultTracker.of(fromVault, polling, marker, node)
    await tracker.start()
  })
  afterEach(() => {
    tracker.stop()
    tracker.marker.store.clear()
  })
  after(() => rmSync(confDir, {recursive: true, force: true}))

  it('should disburse Native currency when transferred from originating chain', async () => {
    const before = await provider.getBalance(account)
    await fromVault.connect(account).checkOutNative(toChainId, {value: amount}).then(_ => _.wait())
    const afterCheckingOut = await provider.getBalance(account)
    expect(afterCheckingOut).toEqual(before - amount)

    await setTimeout(100)
    const proxyAddress = await toVault.proxies(fromChainId, ETH)
    console.log('>'.repeat(50), proxyAddress)
    const proxy = await getContractAt('ERC20Proxy', proxyAddress)
    expect(await proxy.balanceOf(account.address)).toEqual(amount)
  })
})
