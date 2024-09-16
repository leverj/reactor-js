import {accounts} from '@leverj/chain-deployment/test'
import {JsonStore, logger} from '@leverj/common'
import {Contract, ZeroAddress} from 'ethers'
import {expect} from 'expect'
import {zipWith} from 'lodash-es'
import {rmSync} from 'node:fs'
import {setTimeout} from 'node:timers/promises'
import {CrossChainVaultCoordinator} from '../src/CrossChainVaultCoordinator.js'
import config from '../config.js'
import {createChainConfig, getEvmsStore, launchEvms} from './help/chain.js'
import ERC20_abi from './help/ERC20.abi.json' assert {type: 'json'}

const {bridge: {nodesDir}, chain: {polling}} = config

describe('CrossChainVaultCoordinator', () => {
  const amount = 999_999n
  const [deployer, account] = accounts
  const chains = ['holesky', 'sepolia']
  const [fromChain, toChain] = chains
  let fromChainId, toChainId
  let fromVault, toVault
  let fromProvider, toProvider
  let fromToken, toToken
  let processes, coordinator

  before(async () => {
    const chainConfig = await createChainConfig(chains)
    const deploymentDir = `${chainConfig.deploymentDir}/env/${(chainConfig.env)}`
    rmSync(deploymentDir, {recursive: true, force: true})
    processes = await launchEvms(chainConfig)

    const trackersStore = new JsonStore(nodesDir, 'trackers')
    const evms = getEvmsStore(deploymentDir).toObject()
    coordinator = CrossChainVaultCoordinator.of(chains, evms, trackersStore, polling, deployer, logger)
    await coordinator.start()
    expect(coordinator.isRunning).toBe(true);

    ([fromChainId, toChainId] = coordinator.networks.map(_ => _.id));
    ([fromVault, toVault] = [fromChainId, toChainId].map(_ => coordinator.contracts.get(_)));
    ([fromProvider, toProvider] = [fromVault, toVault].map(_ => _.runner.provider));
    ([fromToken, toToken] = zipWith([fromChain, toChain], [fromProvider, toProvider]).map(([chain, provider]) => new Contract(evms[chain].contracts.ERC20Mock.address, ERC20_abi, provider)));
  })

  after(async () => {
    coordinator.stop()
    expect(coordinator.isRunning).toBe(false)
    for (let each of processes) {
      each.kill()
      while(!each.killed) await setTimeout(10)
    }
  })

  const connect = (contract, account, provider) => contract.connect(account.connect(provider))

  describe('detects & acts on a Transfer event', () => {
    it('Native', async () => {
      const NATIVE = await toVault.NATIVE()
      expect(await toVault.proxies(fromChainId, NATIVE)).toEqual(ZeroAddress) // no transfers in yet, so no proxy token created

      const before = {
        from: await fromProvider.getBalance(account),
        to: await toProvider.getBalance(account),
      }
      await connect(fromVault, account, fromProvider).sendNative(toChainId, {value: amount}).then(_ => _.wait())
      await setTimeout(1000)
      const after = {
        from: await fromProvider.getBalance(account),
        to: await toProvider.getBalance(account),
      }
      console.log('$'.repeat(50), {before, after})
      expect(after.from).toEqual(before.from - amount)
      // expect(after.to).toEqual(before.to + amount)
      // expect(await toVault.proxies(fromChainId, NATIVE)).not.toEqual(ZeroAddress) // transferred in, so proxy token created
    })

    it('Token', async () => {
      await connect(fromToken, deployer, fromProvider).mint(account.address, amount)
      await connect(fromToken, account, fromProvider).approve(fromVault.target, amount).then(_ => _.wait())
      expect(await toVault.proxies(fromChainId, fromToken.target)).toEqual(ZeroAddress) // no transfers in yet, so no proxy token created

      const before = {
        from: await connect(fromToken, account, fromProvider).balanceOf(account.address),
        // to: await connect(token, account, toProvider).balanceOf(account.address),
      }
      await connect(fromVault, account, fromProvider).sendToken(toChainId, {value: amount}).then(_ => _.wait())
      await setTimeout(1000)
      const after = {
        from: await connect(fromToken, account, fromProvider).balanceOf(account.address),
        // to: await connect(token, account, toProvider).balanceOf(account.address),
      }
      console.log('$'.repeat(50), {before, after})
      expect(after.from).toEqual(before.from - amount)
      // expect(after.to).toEqual(before.to + amount)
      // expect(await toVault.proxies(fromChainId, NATIVE)).not.toEqual(ZeroAddress) // transferred in, so proxy token created
    })
  })
})
