import {accounts} from '@leverj/chain-deployment/test'
import {JsonStore, logger} from '@leverj/common'
import {ZeroAddress} from 'ethers'
import {expect} from 'expect'
import {rmSync} from 'node:fs'
import {setTimeout} from 'node:timers/promises'
import {CrossChainVaultCoordinator} from '../src/CrossChainVaultCoordinator.js'
import config from '../config.js'
import {createChainConfig, getEvmsStore, launchEvms} from './help/chain.js'

const {bridge: {nodesDir}} = config

describe('CrossChainVaultCoordinator', () => {
  const [, account] = accounts
  const chains = ['holesky', 'sepolia']
  let processes, coordinator

  before(async () => {
    const chainConfig = await createChainConfig(chains)
    const deploymentDir = `${chainConfig.deploymentDir}/env/${(chainConfig.env)}`
    rmSync(deploymentDir, {recursive: true, force: true})
    processes = await launchEvms(chainConfig)
    const trackersStore = new JsonStore(nodesDir, 'trackers')
    const evms = getEvmsStore(deploymentDir).toObject()
    coordinator = CrossChainVaultCoordinator.of(config, chains, evms, trackersStore, chainConfig.deployer, logger)
    await coordinator.start()
    expect(coordinator.isRunning).toBe(true)
  })

  after(async () => {
    coordinator.stop()
    expect(coordinator.isRunning).toBe(false)
    for (let each of processes) {
      each.kill()
      while(!each.killed) await setTimeout(10)
    }
  })

  it('detects & acts on a Transfer event', async () => {
    const [fromChainId, toChainId] = coordinator.networks.map(_ => _.id)
    const [fromVault, toVault] = [fromChainId, toChainId].map(_ => coordinator.contracts.get(_))
    const [fromProvider, toProvider] = [fromVault, toVault].map(_ => _.runner.provider)
    const NATIVE = await toVault.NATIVE()
    expect(await toVault.proxies(fromChainId, NATIVE)).toEqual(ZeroAddress) // no transfers in yet, so no proxy token created

    const amount = 999_999n
    const before = {
      from: await fromProvider.getBalance(account),
      to: await toProvider.getBalance(account),
    }
    await fromVault.connect(account.connect(fromProvider)).checkOutNative(toChainId, {value: amount}).then(_ => _.wait())
    await setTimeout(200)
    const after = {
      from: await fromProvider.getBalance(account),
      to: await toProvider.getBalance(account),
    }
    console.log('>'.repeat(50), {before, after})
    expect(after.from).toEqual(before.from - amount)
    // expect(after.to).toEqual(before.to + amount)
    // expect(await toVault.proxies(fromChainId, NATIVE)).not.toEqual(ZeroAddress) // transferred in, so proxy token created
  })
})
