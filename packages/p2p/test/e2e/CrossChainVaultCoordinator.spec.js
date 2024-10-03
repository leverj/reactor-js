import {accounts} from '@leverj/chain-deployment/hardhat.help'
import {ETH} from '@leverj/common'
import config from '@leverj/reactor.p2p/config'
import {Contract} from 'ethers'
import {expect} from 'expect'
import {zip} from 'lodash-es'
import {setTimeout} from 'node:timers/promises'
import ERC20_abi from './help/ERC20.abi.json' assert {type: 'json'}
import {Evms} from './help/evms.js'
import {Nodes} from './help/nodes.js'
import {Map} from 'immutable'

const {bridge: {nodesDir, threshold}, chain: {polling}} = config

describe.skip('e2e - CrossChainVaultCoordinator', () => {
  const amount = BigInt(1e6 - 1)
  const [deployer, account] = accounts
  const chains = ['holesky', 'sepolia']
  let evms, nodes

  before(async () => {
    // start nodes
    const howMany = threshold + 1
    nodes = new Nodes(config).start()
    await nodes.createApiNodes(howMany)
    // const ports = await nodes.createApiNodes(howMany, false)
    // await nodes.establishWhitelist(ports)
    await nodes.POST(nodes.leaderPort, 'dkg')
    await setTimeout(100)
    const publicKey = await nodes.GET(nodes.leaderPort, 'dkg')
    expect(publicKey).toBeDefined()

    // deploy vaults
    evms = await Evms.with(chains, {publicKey}).then(_ => _.start())
    const deployments = Map(evms.deployed).map(_ => ({
      chainId: _.id,
      providerURL: _.providerURL,
      address: _.contracts.Vault.address,
    })).valueSeq().toArray()
    for (let each of Map(deployments)) await nodes.POST(nodes.leaderPort, 'chain/vault', each)

    // start coordinator
    await nodes.POST(nodes.leaderPort, 'chain/coordinator', {deployer}) //fixme: need to pass the privateKey
    await setTimeout(100)
  })

  after(async () => {
    await evms.stop()
    await nodes.stop()
  })

  const connect = (contract, account, provider) => contract.connect(account.connect(provider))
  const ERC20 = (chain, provider) => new Contract(evms.deployed[chain].contracts.ERC20Mock.address, ERC20_abi, provider)

  it('detects & acts on a Transfer events for both Token & Native, across chains', async () => {
    const [L1, L2] = chains
    const [L1_id, L2_id] = coordinator.chainIds
    const [L1_vault, L2_vault] = coordinator.vaults.valueSeq().toArray()
    const [L1_provider, L2_provider] = [L1_vault, L2_vault].map(_ => _.runner.provider)
    for (let [vault, id] of zip([L1_vault, L2_vault], coordinator.chainIds)) expect(await vault.chainId()).toEqual(id)

    const L2_token = ERC20(L2, L2_provider)
    await connect(L2_token, deployer, L2_provider).mint(account.address, amount)
    await connect(L2_token, account, L2_provider).approve(L2_vault.target, amount).then(_ => _.wait())

    const before = {
      Native: {
        from: await L1_provider.getBalance(account),
        to: await L2_vault.proxyBalanceOf(L1_id, ETH, account.address),
      },
      Token: {
        from: await connect(L2_token, account, L2_provider).balanceOf(account.address),
        to: await L1_vault.proxyBalanceOf(L2_id, L2_token.target, account.address),
      },
    }

    /** L1 => L2 **/ await connect(L1_vault, account, L1_provider).sendNative(L2_id, {value: amount}).then(_ => _.wait())
    /** L2 => L1 **/ await connect(L2_vault, account, L2_provider).sendToken(L1_id, L2_token.target, amount).then(_ => _.wait())
    await setTimeout(100)
    const after = {
      Native: {
        from: await L1_provider.getBalance(account),
        to: await L2_vault.proxyBalanceOf(L1_id, ETH, account.address),
      },
      Token: {
        from: await connect(L2_token, account, L2_provider).balanceOf(account.address),
        to: await L1_vault.proxyBalanceOf(L2_id, L2_token.target, account.address),
      },
    }
    expect(after.Native.from).toEqual(before.Native.from - amount)
    //fixme: not working yet
    // expect(after.Native.to).toEqual(before.Native.to + amount)
    expect(after.Token.from).toEqual(before.Token.from - amount)
    // expect(after.Token.to).toEqual(before.Token.to + amount)
  })
})
