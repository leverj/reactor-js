import {accounts} from '@leverj/chain-deployment/hardhat.help'
import {ETH, JsonStore, logger} from '@leverj/common'
import {signer} from '@leverj/reactor.chain/test'
import {G1ToNumbers, G2ToNumbers} from '@leverj/reactor.mcl'
import {CrossChainVaultCoordinator} from '@leverj/reactor.p2p'
import config from '@leverj/reactor.p2p/config'
import {Contract} from 'ethers'
import {expect} from 'expect'
import {zip} from 'lodash-es'
import {rmSync} from 'node:fs'
import {setTimeout} from 'node:timers/promises'
import {createChainConfig, getEvmsStore, launchEvms} from './help/chain.js'
import ERC20_abi from './help/ERC20.abi.json' assert {type: 'json'}
import {killAll} from './help/processes.js'

const {bridge: {nodesDir}, chain: {polling}} = config

class MessageSigner {
  constructor(signer) { this.signer = signer }
  async sign(from, message) {
    return {
      signature: G1ToNumbers(sign(message, this.signer.secret).signature),
      publicKey: G2ToNumbers(this.signer.pubkey),
    }
  }
}

//fixme: not ready
describe.skip('e2e - CrossChainVaultCoordinator', () => {
  const amount = BigInt(1e6 - 1)
  const [deployer, account] = accounts
  const chains = ['holesky', 'sepolia'], [L1, L2] = chains
  let processes, evms, coordinator

  before(async () => {
    // establish nodes
    /*
    const howMany = threshold + 1
    nodes = await createBridgeNodes(howMany)
    const leader = nodes[0].leadership
    await leader.establishWhitelist()
    await leader.establishGroupPublicKey(howMany)
    await setTimeout(100)
    expect(leader.publicKey).toBeDefined()
     */
    const leader = new MessageSigner(signer) //fixme: replace with leader node
    const publicKey = signer.pubkey.serializeToHexStr()
    // const publicKey = leader.publicKey.serializeToHexStr()

    // establish vaults
    const chainConfig = await createChainConfig(chains, {publicKey})
    const deploymentDir = `${chainConfig.deploymentDir}/${chainConfig.env}`
    rmSync(deploymentDir, {recursive: true, force: true})
    processes = await launchEvms(chainConfig)

    // establish coordinator
    evms = getEvmsStore(deploymentDir).toObject()
    const store = new JsonStore(nodesDir, 'trackers')
    coordinator = CrossChainVaultCoordinator.ofEvms(evms, chains, store, polling, leader, deployer, logger)
    await coordinator.start()
  })

  after(async () => {
    coordinator.stop()
    await killAll(processes)
  })

  const connect = (contract, account, provider) => contract.connect(account.connect(provider))
  const ERC20 = (chain, provider) => new Contract(evms[chain].contracts.ERC20Mock.address, ERC20_abi, provider)

  it('detects & acts on a Transfer events for both Token & Native, across chains', async () => {
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
    expect(after.Native.to).toEqual(before.Native.to + amount)
    expect(after.Token.from).toEqual(before.Token.from - amount)
    expect(after.Token.to).toEqual(before.Token.to + amount)
  })
})
