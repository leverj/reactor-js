import {accounts, wallets, ETH, getContractAt} from '@leverj/chain-deployment'
import {JsonStore, logger} from '@leverj/common'
import {expect} from 'expect'
import {rmSync} from 'node:fs'
import {setTimeout} from 'node:timers/promises'
import {CrossChainVaultCoordinator} from '../src/CrossChainVaultCoordinator.js'
import config from '../config.js'
import {deploymentDir, launchEvms} from './help.js'

const {bridge: {confDir}} = config

describe('CrossChainVaultsTracker', () => {
  const [signer, account] = wallets
  const chains = ['hardhat', 'sepolia']
  let processes, coordinator

  before(async () => {
    const deployedDir = `${deploymentDir}/env/${process.env.NODE_ENV}`
    rmSync(deployedDir, {recursive: true, force: true})
    processes = await launchEvms(chains, processes)
    const evms = new JsonStore(deployedDir, '.evms').toObject()
    const trackerStore = new JsonStore(confDir, 'trackers')
    coordinator = CrossChainVaultCoordinator.of(chains, evms, trackerStore, signer, logger)
  })
  afterEach(() => { if (coordinator.isRunning) coordinator.stop() })
  after(() => processes.forEach(_ => _.kill()))

  it('can start & stop', async () => {
    expect(coordinator.chains).toEqual(chains)
    expect(coordinator.isRunning).toBe(false)

    await coordinator.start()
    expect(coordinator.isRunning).toBe(true)

    coordinator.stop()
    expect(coordinator.isRunning).toBe(false)
  })

  it('acts on a Transfer event', async () => {
    await coordinator.start()
    const [fromChainId, toChainId] = chains.map(_ => coordinator.networks.get(_).id)
    const [fromVault, toVault] = [fromChainId, toChainId].map(_ => coordinator.contracts.get(_))
    const [fromProvider, toProvider] = [fromVault, toVault].map(_ => _.runner.provider)

    const amount = 1_000_000n
    const before = {
      from: await fromProvider.getBalance(account),
      to: await toProvider.getBalance(account),
    }
    // console.log('>'.repeat(50), before)
    return
    account.connect(fromProvider)
    await fromVault.connect(account).checkOutNative(toChainId, {value: amount}).then(_ => _.wait())
    await setTimeout(1000)
    const after = {
      from: await fromProvider.getBalance(account),
      to: await toProvider.getBalance(account),
    }
    // expect(after.from).toEqual(before.from - amount)
    // expect(after.to).toEqual(before.to + amount)
    // console.log('<'.repeat(50), after)

    return //fixme
    const proxyAddress = await toVault.proxies(fromChainId, ETH)
    expect(proxyAddress).not.toEqual(ETH)
    const proxy = await getContractAt('ERC20Proxy', proxyAddress)
    expect(await proxy.balanceOf(account.address)).toEqual(amount)
  })
})
