import {accounts, deployContract, provider} from '@leverj/chain-deployment/hardhat.help'
import {ETH, InMemoryStore, logger} from '@leverj/common'
import {Vault} from '@leverj/reactor.chain/test'
import {CrossChainVaultCoordinator} from '@leverj/reactor.p2p'
import config from '@leverj/reactor.p2p/config'
import {expect} from 'expect'
import {Map} from 'immutable'
import {zip} from 'lodash-es'
import {setTimeout} from 'node:timers/promises'
import {createBridgeNodes} from './help/bridge.js'

const {bridge: {threshold}, chain: {polling}} = config

describe.skip('CrossChainVaultCoordinator', () => {
  const amount = BigInt(1e6 - 1)
  const [deployer, account] = accounts
  let nodes, coordinator

  before(async () => {
    // start nodes
    const howMany = threshold + 1
    nodes = await createBridgeNodes(howMany)
    const leader = nodes[0].leadership
    await leader.establishWhitelist()
    await leader.establishGroupPublicKey(howMany)
    await setTimeout(100)
    expect(leader.publicKey).toBeDefined()

    // deploy vaults
    const chainIds = [10101n, 98989n]
    const vaults = Map(await Promise.all(chainIds.map(async (id) => [id, await Vault(id, leader.publicKey)])))

    // start coordinator
    const store = new InMemoryStore()
    coordinator = CrossChainVaultCoordinator.ofVaults(vaults, store, polling, leader, deployer, logger)
    nodes.forEach(_ => _.setVaults(coordinator.vaults))
    await coordinator.start()
  })

  after(async () => {
    coordinator.stop()
    for (let each of nodes) await each.stop()
  })

  it('detects & acts on a Transfer events for both Token & Native, from one chain to another', async () => {
    const [L1_id, L2_id] = coordinator.chainIds
    const [L1_vault, L2_vault] = coordinator.vaults.valueSeq().toArray()
    const [L1_provider, L2_provider] = [L1_vault, L2_vault].map(_ => _.runner.provider)
    for (let [vault, id] of zip([L1_vault, L2_vault], coordinator.chainIds)) expect(await vault.chainId()).toEqual(id)

    const L2_token = await deployContract('ERC20Mock', ['Gold', '💰'])
    await L2_token.mint(account.address, amount)
    await L2_token.connect(account).approve(L2_vault.target, amount).then(_ => _.wait())

    const before = {
      Native: {
        from: await L1_provider.getBalance(account),
        to: await L2_vault.proxyBalanceOf(L1_id, ETH, account.address),
      },
      Token: {
        from: await L2_token.connect(account).balanceOf(account.address),
        to: await L1_vault.proxyBalanceOf(L2_id, L2_token.target, account.address),
      },
    }

    /** L1 => L2 **/ await L1_vault.connect(account).sendNative(L2_id, {value: amount}).then(_ => _.wait())
    /** L2 => L1 **/ await L2_vault.connect(account).sendToken(L1_id, L2_token.target, amount).then(_ => _.wait())
    await setTimeout(100)
    const after = {
      Native: {
        from: await L1_provider.getBalance(account),
        to: await L2_vault.proxyBalanceOf(L1_id, ETH, account.address),
      },
      Token: {
        from: await L2_token.connect(account).balanceOf(account.address),
        to: await L1_vault.proxyBalanceOf(L2_id, L2_token.target, account.address),
      },
    }
    expect(after.Native.from).toEqual(before.Native.from - amount)
    expect(after.Native.to).toEqual(before.Native.to + amount)
    expect(after.Token.from).toEqual(before.Token.from - amount)
    expect(after.Token.to).toEqual(before.Token.to + amount)
  })
})
