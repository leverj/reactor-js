import {accounts} from '@leverj/chain-deployment/test'
import {ETH, InMemoryStore, logger} from '@leverj/common'
import {ERC20, publicKey, Vault} from '@leverj/reactor.chain/test'
import {expect} from 'expect'
import {setTimeout} from 'node:timers/promises'
import {CrossChainVaultCoordinator} from '../src/CrossChainVaultCoordinator.js'
import config from '../config.js'
import {MasqueradingProvider} from './help/hardhat.js'

const {chain: {polling}} = config

describe('CrossChainVaultCoordinator - embedded', () => {
  const amount = BigInt(1e6 - 1)
  const [deployer, account] = accounts
  const chains = ['holesky', 'sepolia']
  const [fromChain, toChain] = chains
  const [fromChainId, toChainId] = [10101n, 98989n]
  const [fromProvider, toProvider] = [MasqueradingProvider(fromChainId, fromChain), MasqueradingProvider(toChainId, toChain)]
  let fromVault, toVault, fromToken
  let coordinator

  before(async () => {
    fromVault = await Vault(fromChainId, publicKey), toVault = await Vault(toChainId, publicKey)
    fromToken = await ERC20()
    await fromToken.mint(account.address, amount)
    await fromToken.approve(fromVault.target, amount).then(_ => _.wait())

    const trackersStore = new InMemoryStore()
    const evms = {} //fixme: generate from contracts here
    // const [fromChainId, toChainId] = coordinator.networks.map(_ => _.id)
    // const [fromVault, toVault] = [fromChainId, toChainId].map(_ => coordinator.contracts.get(_))
    coordinator = CrossChainVaultCoordinator.of(chains, evms, trackersStore, polling, deployer, logger)
    await coordinator.start()
  })

  after(() => coordinator.stop())

  it('detects & acts on a Transfer events for both Token & Native, from one chain to another', async () => {
    const before = {
      Native: {
        from: await fromProvider.getBalance(account),
        to: await toVault.proxyBalanceOf(fromChainId, ETH, account.address),
      },
      Token: {
        from: await fromToken.connect(account).balanceOf(account.address),
        to: await toVault.proxyBalanceOf(fromChainId, fromToken.target, account.address),
      },
    }

    await fromVault.connect(account).sendNative(toChainId, {value: amount}).then(_ => _.wait())
    await fromVault.connect(account).sendToken(toChainId, fromToken.target, amount).then(_ => _.wait())
    await setTimeout(100)
    const after = {
      Native: {
        from: await fromProvider.getBalance(account),
        to: await toVault.proxyBalanceOf(fromChainId, ETH, account.address),
      },
      Token: {
        from: await fromToken.connect(account).balanceOf(account.address),
        to: await toVault.proxyBalanceOf(fromChainId, fromToken.target, account.address),
      },
    }
    expect(after.Native.from).toEqual(before.Native.from - amount)
    expect(after.Native.to).toEqual(before.Native.to + amount)
    expect(after.Token.from).toEqual(before.Token.from - amount)
    expect(after.Token.to).toEqual(before.Token.to + amount)
  })
})
