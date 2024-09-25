import {accounts, deployContract, provider} from '@leverj/chain-deployment/hardhat.help'
import {ETH, InMemoryStore, logger} from '@leverj/common'
import {Vault} from '@leverj/reactor.chain/test'
import {CrossChainVaultCoordinator} from '@leverj/reactor.p2p'
import config from '@leverj/reactor.p2p/config'
import {expect} from 'expect'
import {Map} from 'immutable'
import {zip, zipWith} from 'lodash-es'
import {setTimeout} from 'node:timers/promises'
import {createBridgeNodes} from './help/bridge.js'

const {bridge: {threshold}, chain: {polling}} = config

describe('CrossChainVaultCoordinator', () => {
  const amount = BigInt(1e6 - 1)
  const [deployer, account] = accounts
  let nodes, networks, coordinator

  beforeEach(async () => {
    // establish nodes
    const howMany = threshold + 1
    nodes = await createBridgeNodes(howMany)
    const leader = nodes[0]
    await leader.publishWhitelist()
    await leader.startDKG(howMany)
    await setTimeout(100)
    expect(leader.publicKey).toBeDefined()

    // establish vaults
    networks = zipWith(['holesky', 'sepolia'], [10101n, 98989n]).map(([label, id]) => ({id, label, provider}))
    for (let each of networks) each.Vault = await Vault(each.id, leader.publicKey)
    const vaults = Map(networks.map(_ => [_.id, _.Vault])).toJS()
    nodes.forEach(_ => _.setVaults(vaults))

    // establish coordinator
    const chainIds = networks.map(_ => _.id)
    const store = new InMemoryStore()
    coordinator = CrossChainVaultCoordinator.ofVaults(chainIds, vaults, store, polling, leader, deployer, logger)
    await coordinator.start()
  })

  afterEach(async () => {
    coordinator.stop()
    for (let each of nodes) await each.stop()
  })

  it('detects & acts on a Transfer events for both Token & Native, from one chain to another', async () => {
    const [L1_id, L2_id] = networks.map(_ => _.id)
    const [L1_vault, L2_vault] = networks.map(_ => _.Vault)
    const [L1_provider, L2_provider] = networks.map(_ => _.provider)
    for (let [vault, id] of zip([L1_vault, L2_vault], coordinator.chainIds)) expect(await vault.chainId()).toEqual(id)

    const L1_token = await deployContract('ERC20Mock', ['Gold', '💰'])
    await L1_token.mint(account.address, amount)
    await L1_token.connect(account).approve(L1_vault.target, amount).then(_ => _.wait())

    const before = {
      Native: {
        from: await L1_provider.getBalance(account),
        to: await L2_vault.proxyBalanceOf(L1_id, ETH, account.address),
      },
      Token: {
        from: await L1_token.connect(account).balanceOf(account.address),
        to: await L2_vault.proxyBalanceOf(L1_id, L1_token.target, account.address),
      },
    }

    /** L1 => L2 **/ await L1_vault.connect(account).sendNative(L2_id, {value: amount}).then(_ => _.wait())
    /** L1 => L2 **/ await L1_vault.connect(account).sendToken(L2_id, L1_token.target, amount).then(_ => _.wait())
    await setTimeout(100)
    const after = {
      Native: {
        from: await L1_provider.getBalance(account),
        to: await L2_vault.proxyBalanceOf(L1_id, ETH, account.address),
      },
      Token: {
        from: await L1_token.connect(account).balanceOf(account.address),
        to: await L2_vault.proxyBalanceOf(L1_id, L1_token.target, account.address),
      },
    }
    expect(after.Native.from).toEqual(before.Native.from - amount)
    expect(after.Native.to).toEqual(before.Native.to + amount)
    expect(after.Token.from).toEqual(before.Token.from - amount)
    expect(after.Token.to).toEqual(before.Token.to + amount)
  })
})
