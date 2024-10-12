import {accounts} from '@leverj/lever.chain-deployment/hardhat.help'
import {ETH} from '@leverj/lever.common'
import {stubs} from '@leverj/reactor.chain/contracts'
import config from '@leverj/reactor.p2p/config'
import {Contract} from 'ethers'
import {expect} from 'expect'
import {zip} from 'lodash-es'
import {setTimeout} from 'node:timers/promises'
import ERC20_abi from './help/ERC20.abi.json' assert {type: 'json'}
import {Evms} from './help/evms.js'
import {Nodes} from './help/nodes.js'

describe('e2e - CrossChainVaultCoordinator', () => {
  const amount = BigInt(1e6 - 1)
  const [deployer, account] = accounts
  const chains = ['holesky', 'sepolia']
  let nodes, evms, deployments

  before(async () => {
    // start nodes
    nodes = new Nodes(config).start()
    const publicKey = await nodes.createNodes()
    expect(publicKey).toBeDefined()

    // deploy vaults
    evms = await Evms.with(chains, {publicKey}).then(_ => _.start())
    deployments = evms.getDeployments()
  })

  after(async () => {
    await evms.stop()
    await nodes.stop()
  })

  const connect = (contract, account, provider) => contract.connect(account.connect(provider))

  it('detects & acts on a Transfer events for both Token & Native, across chains', async () => {
    for (let {id: chainId, providerURL, Vault: {address}} of deployments) {
      await nodes.addVault(chainId, address, providerURL)
    }

    const [L1, L2] = deployments.map(_ => _.label)
    const [L1_id, L2_id] = deployments.map(_ => _.id)
    const [L1_provider, L2_provider] = deployments.map(_ => _.provider)
    const [L1_vault, L2_vault] = deployments.map(_ => stubs.Vault(_.Vault.address, _.provider))
    for (let [vault, id] of zip([L1_vault, L2_vault], [L1_id, L2_id])) expect(await vault.chainId()).toEqual(id)

    const L2_token = new Contract(evms.deployed[L2].contracts.ERC20Mock.address, ERC20_abi, L2_provider)
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
    expect(after.Native.to).toEqual(before.Native.to + amount)
    expect(after.Token.from).toEqual(before.Token.from - amount)
    expect(after.Token.to).toEqual(before.Token.to + amount)
  })
})
