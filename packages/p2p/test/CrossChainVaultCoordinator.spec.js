import {accounts} from '@leverj/chain-deployment/test'
import {ETH, JsonStore, logger} from '@leverj/common'
import {Contract} from 'ethers'
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
  let processes, evms, coordinator

  before(async () => {
    const chainConfig = await createChainConfig(chains)
    const deploymentDir = `${chainConfig.deploymentDir}/env/${(chainConfig.env)}`
    rmSync(deploymentDir, {recursive: true, force: true})
    processes = await launchEvms(chainConfig)

    const trackersStore = new JsonStore(nodesDir, 'trackers')
    evms = getEvmsStore(deploymentDir).toObject()
    coordinator = CrossChainVaultCoordinator.of(chains, evms, trackersStore, polling, deployer, logger)
    await coordinator.start()
    expect(coordinator.isRunning).toBe(true);

    ([fromChainId, toChainId] = coordinator.networks.map(_ => _.id));
    ([fromVault, toVault] = [fromChainId, toChainId].map(_ => coordinator.contracts.get(_)));
    ([fromProvider, toProvider] = [fromVault, toVault].map(_ => _.runner.provider));
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
  const ERC20 = (chain, provider) => new Contract(evms[chain].contracts.ERC20Mock.address, ERC20_abi, provider)

  describe('detects & acts on a Transfer event', () => {
    it('Native', async () => {
      const before = {
        from: await fromProvider.getBalance(account),
        to: await toVault.proxyBalanceOf(fromChainId, ETH, account.address),
      }

      expect(await connect(fromVault, account, fromProvider).balances(ETH)).toEqual(0n)
      await connect(fromVault, account, fromProvider).sendNative(toChainId, {value: amount}).then(_ => _.wait())
      expect(await connect(fromVault, account, fromProvider).balances(ETH)).toEqual(amount)

      await setTimeout(10)
      const after = {
        from: await fromProvider.getBalance(account),
        to: await toVault.proxyBalanceOf(fromChainId, ETH, account.address),
      }
      expect(after.from).toEqual(before.from - amount)
      expect(after.to).toEqual(before.to + amount)
    })

    it('Token', async () => {
      const fromToken = ERC20(fromChain, fromProvider)
      await connect(fromToken, deployer, fromProvider).mint(account.address, amount)
      await connect(fromToken, account, fromProvider).approve(fromVault.target, amount).then(_ => _.wait())

      const before = {
        from: await connect(fromToken, account, fromProvider).balanceOf(account.address),
        to: await toVault.proxyBalanceOf(fromChainId, fromToken.target, account.address),
      }

      expect(await connect(fromVault, account, fromProvider).balances(fromToken.target)).toEqual(0n)
      await connect(fromVault, account, fromProvider).sendToken(toChainId, fromToken.target, amount).then(_ => _.wait())
      expect(await connect(fromVault, account, fromProvider).balances(fromToken.target)).toEqual(amount)

      await setTimeout(10)
      const after = {
        from: await connect(fromToken, account, fromProvider).balanceOf(account.address),
        to: await toVault.proxyBalanceOf(fromChainId, fromToken.target, account.address),
      }
      expect(after.from).toEqual(before.from - amount)
      expect(after.to).toEqual(before.to + amount)
    })

    it.skip('all together now ...', async () => {
      // const [fromToken, toToken] = zipWith([fromChain, toChain], [fromProvider, toProvider]).map(([chain, provider]) => ERC20(chain, provider))
    })
  })
})
