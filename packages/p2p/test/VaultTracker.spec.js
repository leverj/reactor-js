import {ETH} from '@leverj/common/utils'
import {encodeTransfer} from '@leverj/reactor.chain/contracts'
import {evm, getContractAt, getSigners, provider, Vault} from '@leverj/reactor.chain/test'
import {TrackerMarker, VaultTracker} from '@leverj/reactor.chain/tracking'
import {G1ToNumbers, G2ToNumbers, newKeyPair, sign} from '@leverj/reactor.mcl'
import config from 'config'
import {expect} from 'expect'
import {rmSync} from 'node:fs'
import {setTimeout} from 'node:timers/promises'
import {KeyvJsonStore} from '../src/utils/index.js'

const [, account] = await getSigners()
const {bridgeNode: {confDir}, chain: {polling}} = config

const checkIn = async (log, vault, signer, publicKey) => {
  const {hash, origin, token, name, symbol, decimals, amount, owner, from, to, tag} = log.args
  const payload = encodeTransfer(origin, token, name, symbol, decimals, amount, owner, from, to, tag)
  const signature = G1ToNumbers(sign(hash, signer.secret).signature)
  await vault.checkIn(signature, publicKey, payload).then(_ => _.wait())
}

describe.skip('VaultTracker', () => {
  const signer = newKeyPair(), publicKey = G2ToNumbers(signer.pubkey)
  const amount = 1000n
  const fromChainId = evm.chainId, toChainId = 98989n
  let fromVault, toVault, tracker, store

  beforeEach(async () => {
    fromVault = await Vault(fromChainId, publicKey)
    toVault = await Vault(toChainId, publicKey)

    const store = new KeyvJsonStore(confDir, 'TrackerMarker')
    const marker = TrackerMarker.of(store, evm.chainId)
    const node = {processLog: async _ => checkIn(_, toVault, signer, publicKey)}
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

    await setTimeout(1000)
    const proxy = await getContractAt('ERC20Proxy', await toVault.proxies(fromChainId, ETH))
    expect(await proxy.balanceOf(account.address)).toEqual(amount)
  })
})
