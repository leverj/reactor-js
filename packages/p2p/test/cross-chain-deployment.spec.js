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
  let processes

  before(async () => {
    rmSync(deployedDir, {recursive: true, force: true})
    processes = []
  })
  afterEach(() => processes.forEach(_ => _.kill()))

  it('enquire balances on all chains', async () => {
    processes = await launchEvms(chains)
    const evms = new JsonStore(deployedDir, '.evms').toObject()
    const networks = Map(evms).map(_ => ({
      id: _.id,
      label: _.label,
      provider: new JsonRpcProvider(_.providerURL),
    }))
    for (let each of networks.valueSeq().toArray()) {
      const {id, label, provider} = each
      const balance = await provider.getBalance(account)
      expect(balance).toBeGreaterThan(0n)
      console.log(id.toString().padStart(8), label, `@ ${account.address}`, '$'.repeat(3), balance)
    }
  })

  it('transacts with deployed contracts', async () => {
    // const chains = ['holesky']
    // const [deployer, account] = wallets
    const [deployer, account] = accounts
    processes = await launchEvms(chains)
    const evms = new JsonStore(deployedDir, '.evms').toObject()
    const networks = Map(evms).map(_ => ({
      id: _.id,
      label: _.label,
      nativeCurrency: _.nativeCurrency,
      Vault: _.contracts.Vault,
      provider: new JsonRpcProvider(_.providerURL),
    }))
    for (let each of networks.valueSeq().toArray()) {
      const {id, label, nativeCurrency, provider, Vault} = each
      const contract = stubs.Vault(Vault.address, provider)
      //fixme: failing to connect to actual network if launched more then one
      console.log(await contract.home())
      const [chainId, chainName, nativeSymbol, nativeDecimals] = await contract.home()
      expect(chainId).toEqual(BigInt(id))
      expect(chainName).toEqual(nativeCurrency.name)
      expect(nativeSymbol).toEqual(nativeCurrency.symbol)
      expect(nativeDecimals).toEqual(BigInt(nativeCurrency.decimals))

      const currency = await contract.NATIVE(), amount = 1000n
      const toChainId = chainId + 1n
      const before = await contract.balances(currency)
      const signers = [deployer, account]//.map(_ => _.connect(provider))
      for (let signer of signers) {
        await contract.connect(signer).checkOutNative(toChainId, {value: amount}).then(_ => _.wait())
      }
      const after = await contract.balances(currency)
      console.log('>'.repeat(50), {before, after}, 'expected:', before + amount * BigInt(signers.length))
      continue
      expect(after).toEqual(before + amount * BigInt(signers.length))
    }
  })
})
