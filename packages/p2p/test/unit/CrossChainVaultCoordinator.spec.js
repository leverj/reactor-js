import {accounts, provider, deployContract} from '@leverj/chain-deployment/hardhat.help'
import {ETH} from '@leverj/common'
import {Vault} from '@leverj/reactor.chain/test'
import {CrossChainVaultCoordinator} from '@leverj/reactor.p2p'
import config from '@leverj/reactor.p2p/config'
import {expect} from 'expect'
import {zip} from 'lodash-es'
import {setTimeout} from 'node:timers/promises'
import {Nodes} from './help/nodes.js'

describe('CrossChainVaultCoordinator', () => {
  const amount = BigInt(1e6 - 1)
  const [, account] = accounts
  let nodes, deployments

  before(async () => {
    // start nodes
    nodes = await new Nodes(config).start()
    const publicKey = nodes.leader.publicKey
    expect(publicKey).toBeDefined()

    // deploy vaults
    const chainsIds = [10101n, 98989n]
    const vaults = []
    for (let each of chainsIds) vaults.push(await Vault(each, publicKey))
    deployments = zip(vaults, chainsIds).map(([vault, id]) => ({id, vault, provider}))
  })

  after(async () => await nodes.stop())

  it('detects & acts on a Transfer events for both Token & Native, from one chain to another', async () => {
    for (let {id, vault} of deployments) {
      nodes.addVault(id, vault)
    }

    const [L1_id, L2_id] = deployments.map(_ => _.id)
    const [L1_vault, L2_vault] = deployments.map(_ => _.vault)
    const [L1_provider, L2_provider] = deployments.map(_ => _.provider)
    for (let [vault, id] of zip([L1_vault, L2_vault], [L1_id, L2_id])) expect(await vault.chainId()).toEqual(id)

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
    await setTimeout(100) // need to wait a bit to avoid 'Nonce too low' error
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
