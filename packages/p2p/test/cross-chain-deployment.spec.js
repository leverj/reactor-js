import 'dotenv/config'
import {accounts} from '@leverj/chain-deployment'
import {JsonStore} from '@leverj/common'
import {stubs} from '@leverj/reactor.chain/contracts'
import {JsonRpcProvider} from 'ethers'
import {expect} from 'expect'
import {Map} from 'immutable'
import {rmSync} from 'node:fs'
import {deploymentDir, launchEvms} from './help.js'

describe('deploy across multiple chains', () => {
  const deployedDir = `${deploymentDir}/env/${process.env.NODE_ENV}`
  const chains = ['hardhat', 'sepolia', 'holesky']
  const [deployer, account] = accounts
  let processes, networks

  before(async () => {
    rmSync(deployedDir, {recursive: true, force: true})
    processes = await launchEvms(chains)
    const evms = new JsonStore(deployedDir, '.evms').toObject()
    networks = Map(evms).map(_ => ({
      id: _.id,
      label: _.label,
      nativeCurrency: _.nativeCurrency,
      provider: new JsonRpcProvider(_.providerURL),
      Vault: _.contracts.Vault,
    })).valueSeq().toArray()
  })
  afterEach(() => processes.forEach(_ => _.kill()))

  it('connect to provider and query balances on each chain', async () => {
    for (let each of networks) {
      const {provider, Vault} = each
      const balance = await provider.getBalance(account)
      expect(Vault.address).toBeDefined()
      expect(Vault.blockCreated).toBeGreaterThan(0)
      expect(balance).toBeGreaterThan(0n)
      // console.log(id.toString().padStart(8), _.label, account.address, '$'.repeat(3), balance)
    }
  })

  it('connect to contract and query on each chain', async () => {
    for (let each of networks) {
      const {id, nativeCurrency, provider, Vault} = each
      const contract = stubs.Vault(Vault.address, provider)
      const [chainId, chainName, nativeSymbol, nativeDecimals] = await contract.home()
      expect(chainId).toEqual(BigInt(id))
      expect(chainName).toEqual(nativeCurrency.name)
      expect(nativeSymbol).toEqual(nativeCurrency.symbol)
      expect(nativeDecimals).toEqual(BigInt(nativeCurrency.decimals))
      // console.log(await contract.home())
    }
  })

  it('connect to contract and transact on each chain', async () => {
    for (let each of networks) {
      const {provider, Vault} = each
      const contract = stubs.Vault(Vault.address, provider)
      const currency = await contract.NATIVE(), amount = 1000n
      const toChainId = await contract.chainId() + 1n
      const before = await contract.balances(currency)
      const signers = [deployer, account].map(_ => _.connect(provider))
      for (let signer of signers) {
        await contract.connect(signer).checkOutNative(toChainId, {value: amount}).then(_ => _.wait())
      }
      const after = await contract.balances(currency)
      expect(after).toEqual(before + amount * BigInt(signers.length))
      // console.log({before, after})
    }
  })
})
