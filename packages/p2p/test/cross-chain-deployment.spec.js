import 'dotenv/config'
import {accounts, wallets, Deploy} from '@leverj/chain-deployment'
import {JsonStore, logger} from '@leverj/common'
import {stubs} from '@leverj/reactor.chain/contracts'
import {JsonRpcProvider} from 'ethers'
import {expect} from 'expect'
import {Map} from 'immutable'
import {rmSync} from 'node:fs'
import waitOn from 'wait-on'
import {Chain, createDeployConfig, deploymentDir, launchEvm, launchEvms} from './help.js'

describe('deploy across multiple chains', () => {
  const deployedDir = `${deploymentDir}/env/${process.env.NODE_ENV}`
  let processes

  before(async () => {
    rmSync(deployedDir, {recursive: true, force: true})
    processes = []
  })
  afterEach(() => processes.forEach(_ => _.kill()))

  it('deploys all contracts', async () => {
    const chains = ['hardhat', 'sepolia', 'mainnet']
    for (let [i, chain] of chains.entries()) {
      const port = 8101 + i
      const config = createDeployConfig(chain, chains, {providerURL: `http://localhost:${port}`})
      const network = config.networks[chain]
      processes.push(launchEvm(config, port))
      await waitOn({resources: [network.providerURL], timeout: 10_000})
      const deploy = Deploy.from(config, {logger})
      expect(deploy.deployedContracts.Vault).not.toBeDefined()
      const {id, label} = await Chain.from(deploy.provider)
      expect(id).toEqual(network.id)
      expect(label).toEqual(network.label)

      await deploy.run()
      expect(deploy.deployedContracts.Vault).toBeDefined()
    }
  })

  it('enquire balances on all chains', async () => {
    const chains = ['hardhat', 'sepolia', 'mainnet']
    const [deployer, account] = accounts
    processes = await launchEvms(chains)
    const evms = new JsonStore(deployedDir, '.evms').toObject()
    const networks = Map(evms).map(_ => ({
      id: _.id,
      label: _.label,
      nativeCurrency: _.nativeCurrency,
      providerURL: _.providerURL,
      provider: new JsonRpcProvider(_.providerURL),
      Vault: _.contracts.Vault,
    }))
    for (let _ of networks.valueSeq().toArray()) {
      const provider = _.provider
      for (let each of [deployer, account]) {
        const balance = await provider.getBalance(account)
        expect(balance).toBeGreaterThan(0n)
        console.log(_.id.toString().padStart(8), _.label, `@ ${each.address}`, '$'.repeat(3), balance)
      }
    }
  })

  it('transacts with deployed contracts', async () => {
    const chains = ['mainnet']
    // const chains = ['hardhat', 'sepolia', 'mainnet']
    // const [deployer, account] = wallets
    const [deployer, account] = accounts
    processes = await launchEvms(chains)
    const evms = new JsonStore(deployedDir, '.evms').toObject()
    const networks = Map(evms).map(_ => ({
      id: _.id,
      label: _.label,
      nativeCurrency: _.nativeCurrency,
      providerURL: _.providerURL,
      provider: new JsonRpcProvider(_.providerURL),
      Vault: _.contracts.Vault,
    }))
    for (let _ of networks.valueSeq().toArray()) {
      const provider = _.provider
      const contract = stubs.Vault(_.Vault.address, provider)
      //fixme: failing to connect to actual network if launched more then one
      console.log(await contract.home())
      const [chainId, chainName, nativeSymbol, nativeDecimals] = await contract.home()
      expect(chainId).toEqual(BigInt(_.id))
      expect(chainName).toEqual(_.nativeCurrency.name)
      expect(nativeSymbol).toEqual(_.nativeCurrency.symbol)
      expect(nativeDecimals).toEqual(BigInt(_.nativeCurrency.decimals))

      const currency = await contract.NATIVE(), amount = 1000n
      const toChainId = chainId + 1n
      const before = await contract.balances(currency)
      const signers = [deployer, account]//.map(_ => _.connect(provider))
      for (let each of signers) {
        await contract.connect(each).checkOutNative(toChainId, {value: amount}).then(_ => _.wait())
      }
      const after = await contract.balances(currency)
      console.log('>'.repeat(50), {before, after}, 'expected:', before + amount * BigInt(signers.length))
      continue
      expect(after).toEqual(before + amount * BigInt(signers.length))
    }
  })
})
