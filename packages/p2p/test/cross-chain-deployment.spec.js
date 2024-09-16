import {accounts} from '@leverj/chain-deployment/test'
import {stubs} from '@leverj/reactor.chain/contracts'
import {expect} from 'expect'
import {rmSync} from 'node:fs'
import {setTimeout} from 'node:timers/promises'
import {createChainConfig, getDeployedNetworks, launchEvms} from './help/chain.js'

describe('deploy across multiple chains', () => {
  const [, account] = accounts
  const chains = ['holesky', 'sepolia']
  let processes, deployments

  before(async () => {
    const config = await createChainConfig(chains)
    const deploymentDir = `${config.deploymentDir}/env/${config.env}`
    rmSync(deploymentDir, {recursive: true, force: true})
    processes = await launchEvms(config)
    deployments = getDeployedNetworks(deploymentDir)
  })

  after(async () => {
    for (let each of processes) {
      each.kill()
      while(!each.killed) await setTimeout(10)
    }
  })

  it('connect to provider and query balances on each chain', async () => {
    for (let each of deployments) {
      const {provider, Vault} = each
      const balance = await provider.getBalance(account)
      expect(Vault.address).toBeDefined()
      expect(Vault.blockCreated).toBeGreaterThan(0)
      expect(balance).toBeGreaterThan(0n)
      // console.log(id.toString().padStart(8), _.label, account.address, '$'.repeat(3), balance)
    }
  })

  it('connect to contract and query on each chain', async () => {
    for (let each of deployments) {
      const {id, nativeCurrency, provider, Vault} = each
      const contract = stubs.Vault(Vault.address, provider)
      const [chainId, chainName, nativeSymbol, nativeDecimals] = await contract.home()
      expect(chainId).toEqual(id)
      expect(chainName).toEqual(nativeCurrency.name)
      expect(nativeSymbol).toEqual(nativeCurrency.symbol)
      expect(nativeDecimals).toEqual(BigInt(nativeCurrency.decimals))
      // console.log(await contract.home())
    }
  })

  it('connect to contract and transact on each chain', async () => {
    for (let each of deployments) {
      const {provider, Vault} = each
      const contract = stubs.Vault(Vault.address, provider)
      const currency = await contract.NATIVE(), amount = 1000n
      const toChainId = await contract.chainId() + BigInt(1e+12)
      const before = await contract.balances(currency)
      await contract.connect(account.connect(provider)).sendNative(toChainId, {value: amount}).then(_ => _.wait())
      const after = await contract.balances(currency)
      expect(after).toEqual(before + amount)
    }
  })
})
