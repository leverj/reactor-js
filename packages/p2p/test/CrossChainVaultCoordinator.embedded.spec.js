import {accounts} from '@leverj/chain-deployment'
import {JsonStore, logger} from '@leverj/common'
import {expect} from 'expect'
import {setTimeout} from 'node:timers/promises'
import {CrossChainVaultCoordinator} from '../src/CrossChainVaultCoordinator.js'
import config from '../config.js'
import {ZeroAddress} from 'ethers'

const {bridge: {confDir}} = config

describe('CrossChainVaultsTracker', () => {
  // const fromChainId = 10101n, toChainId = 98989n, amount = 1_000_000n
  // const chains = [fromChainId, toChainId]
  const chains = ['holesky', 'sepolia']
  const [, deployer, account] = accounts
  let coordinator

  before(async () => {
    const evms = new JsonStore(deployedDir, '.evms').toObject()
    //fixme: make all providerURL to hardhat
    const trackerStore = new JsonStore(confDir, 'trackers')
    coordinator = CrossChainVaultCoordinator.of(chains, evms, trackerStore, deployer, logger)
    await coordinator.start()
  })
  after(() => coordinator.stop())

  it('can start & stop', async () => {
    expect(coordinator.chains).toEqual(chains)
    expect(coordinator.isRunning).toBe(true)

    coordinator.stop()
    expect(coordinator.isRunning).toBe(false)

    await coordinator.start()
    expect(coordinator.isRunning).toBe(true)
  })

  it('detects & acts on a Transfer event', async () => {
    await coordinator.start()
    const [fromChainId, toChainId] = coordinator.networks.map(_ => _.id)
    const [fromVault, toVault] = [fromChainId, toChainId].map(_ => coordinator.contracts.get(_))
    const [fromProvider, toProvider] = [fromVault, toVault].map(_ => _.runner.provider) // masquerade provider?
    const NATIVE = await toVault.NATIVE()
    expect(await toVault.proxies(fromChainId, NATIVE)).toEqual(ZeroAddress) // no transfers in yet, so no proxy token created

    const amount = 999_999n
    const before = {
      from: await fromProvider.getBalance(account),
      to: await toProvider.getBalance(account),
    }
    await fromVault.connect(account).checkOutNative(toChainId, {value: amount}).then(_ => _.wait())
    // await fromVault.connect(account.connect(fromProvider)).checkOutNative(toChainId, {value: amount}).then(_ => _.wait())
    await setTimeout(1000)
    const after = {
      from: await fromProvider.getBalance(account),
      to: await toProvider.getBalance(account),
    }
    expect(after.from).toEqual(before.from - amount)
    // expect(after.to).toEqual(before.to + amount)
    console.log('<'.repeat(50), {before, after})

    return //fixme
    expect(await toVault.proxies(fromChainId, NATIVE)).not.toEqual(ZeroAddress) // transferred in, so proxy token created
  })
})
