import {accounts, deployContract, provider} from '@leverj/chain-deployment/test'
import {ETH, InMemoryStore, logger} from '@leverj/common'
import {publicKey, signer, Vault} from '@leverj/reactor.chain/test'
import {CrossChainVaultCoordinator, MessageVerifier} from '@leverj/reactor.p2p'
import config from '@leverj/reactor.p2p/config'
import {expect} from 'expect'
import {Map} from 'immutable'
import {zip, zipWith} from 'lodash-es'
import {setTimeout} from 'node:timers/promises'

describe('CrossChainVaultCoordinator, both from L1 => L2 & L2 => L1', () => {
  const amount = BigInt(1e6 - 1)
  const [deployer, account] = accounts
  let networks, coordinator

  before(async () => {
    networks = zipWith(['holesky', 'sepolia'], [10101n, 98989n]).map(
      ([label, id]) => ({id, label, provider}),
    )
    for (let each of networks) {
      const {id, provider} = each
      each.Vault = await Vault(id, publicKey)
    }
    coordinator = CrossChainVaultCoordinator.ofVaults(
      networks.map(_ => _.id),
      Map(networks.map(_ => [_.id, _.Vault])),
      new InMemoryStore(),
      config.chain.polling,
      new MessageVerifier(signer), //fixme: should be the same as the vaults where created with
      deployer,
      logger,
    )
    await coordinator.start()
  })

  after(() => coordinator.stop())

  it('detects & acts on a Transfer events for both Token & Native, from one chain to another', async () => {
    const [L1_id, L2_id] = networks.map(_ => _.id)
    const [L1_vault, L2_vault] = networks.map(_ => _.Vault)
    const [L1_provider, L2_provider] = networks.map(_ => _.provider)
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
