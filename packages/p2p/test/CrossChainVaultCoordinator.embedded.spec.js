import {accounts, deployContract} from '@leverj/chain-deployment/test'
import {ETH, InMemoryStore, logger} from '@leverj/common'
import {publicKey, signer, Vault} from '@leverj/reactor.chain/test'
import {CrossChainVaultCoordinator, MessageVerifier} from '@leverj/reactor.p2p'
import config from '@leverj/reactor.p2p/config'
import {expect} from 'expect'
import {setTimeout} from 'node:timers/promises'
import {MasqueradingProvider} from './help/hardhat.js'
import {zipWith} from 'lodash-es'
import {Map} from 'immutable'

const {chain: {polling}} = config

describe('CrossChainVaultCoordinator - embedded', () => {
  const amount = BigInt(1e6 - 1)
  const [deployer, account] = accounts
  const chains = ['holesky', 'sepolia']
  const [fromChain, toChain] = chains
  const [fromChainId, toChainId] = [10101n, 98989n]
  const [fromProvider, toProvider] = [MasqueradingProvider(fromChainId, fromChain), MasqueradingProvider(toChainId, toChain)]


  let fromVault, toVault
  let coordinator

  before(async () => {
    const networks = zipWith(['holesky', 'sepolia'], [10101n, 98989n]).map(async ([label, id]) => ({
      id,
      label,
      provider: MasqueradingProvider(id, label),
      Vault: await Vault(id, publicKey),
    }))
    const chainIds = networks.map(_ => _.id)
    const vaults = Map(networks.map(_ => [_.id, _.Vault]))

    // const [fromChainId, toChainId] = coordinator.networks.map(_ => _.id)
    // const [fromVault, toVault] = [fromChainId, toChainId].map(_ => coordinator.contracts.get(_))
    // const networks = {} //fixme: generate from contracts here
    const trackersStore = new InMemoryStore()
    const verifier = new MessageVerifier(signer) //fixme should be tha same as the vaults where created with
    coordinator = CrossChainVaultCoordinator.ofVaults(chainIds, vaults, trackersStore, polling, verifier, deployer, logger)
    await coordinator.start()
  })

  after(() => coordinator.stop())

  it('detects & acts on a Transfer events for both Token & Native, from one chain to another', async () => {
    const fromToken = await deployContract('ERC20Mock', ['Gold', '💰'])
    await fromToken.mint(account.address, amount)
    await fromToken.approve(fromVault.target, amount).then(_ => _.wait())

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
