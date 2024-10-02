import {accounts} from '@leverj/chain-deployment/hardhat.help'
import {stubs} from '@leverj/reactor.chain/contracts'
import {expect} from 'expect'
import {Evms} from './help/evms.js'

describe('e2e - deploy across multiple chains', () => {
  const [, account] = accounts
  const chains = ['holesky', 'sepolia']
  let evms

  before(async () => evms = await Evms.with(chains).then(_ => _.start()))
  after(async () => await evms.stop())

  it('connect to provider and query balances on each chain', async () => {
    for (let each of evms.getDeployments()) {
      const {provider, Vault} = each
      const balance = await provider.getBalance(account)
      expect(Vault.address).toBeDefined()
      expect(Vault.blockCreated).toBeGreaterThan(0)
      expect(balance).toBeGreaterThan(0n)
      // console.log(id.toString().padStart(8), _.label, account.address, '$'.repeat(3), balance)
    }
  })

  it('connect to contract and query on each chain', async () => {
    for (let each of evms.getDeployments()) {
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
    for (let each of evms.getDeployments()) {
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
