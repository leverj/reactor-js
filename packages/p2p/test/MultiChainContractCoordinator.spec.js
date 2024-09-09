import {accounts, chainId, provider} from '@leverj/chain-deployment'
import {ERC20} from '@leverj/chain-tracking/test'
import {expect} from 'expect'
import {Deploy} from '@leverj/chain-deployment'
import {logger} from '@leverj/common'
import {Map} from 'immutable'
import {Contract} from 'ethers'

export class MultiChainContractCoordinator {
  constructor() {
    this.chains = Map().asMutable()
    this.contracts = Map().asMutable()
  }

  chainAt(chainId) { return this.chains.get(chainId) }
  providerAt(chainId) { return this.chainAt(chainId).provider }
  contractAt(chainId, address) { return this.contracts.getIn([chainId, address]) }

  async joinChain(provider) {
    const chain = await Chain.from(provider)
    this.chains.set(chain.id, chain)
  }

  joinContract(chainId, address, abi) {
    const contract = new Contract(address, abi, this.providerAt(chainId))
    this.contracts.setIn([chainId, address], contract)
    return contract
  }

  async deployTo(chainId) {
    const chains = this.chains.values().map(_ => _.label)
    const chain = this.chainAt(chainId).label
    const config = {chain, chains} // createDeployConfig(chain, chains) //fixme
    const deploy = Deploy.from(config)
    await deploy.run().catch(logger.error)
    const address = deploy.store.get(chain).contracts.Vault.address
    const contract = new Contract(address, abi, this.providerAt(chainId))
    this.contracts.setIn([chainId, address], contract)
    return contract
  }

  start() {}
  stop() {}
}

class Chain {
  static async from(provider) {
    const {chainId, name} = await provider.getNetwork()
    return new this(chainId, name, provider)
  }

  constructor(id, label, provider) {
    this.id = id
    this.label = label
    this.provider = provider
  }
}

describe('MultiChainContractCoordinator', () => {
  const [deployer, account] = accounts
  const coordinator = new MultiChainContractCoordinator()

  beforeEach(() => coordinator.start())
  afterEach(() => coordinator.stop())

  it('can join a chain', async () => {
    await coordinator.joinChain(provider)
    expect(coordinator.providerAt(chainId)).toBe(provider)

    const chain = coordinator.chainAt(chainId)
    expect(chain.id).toBe(chainId)
    expect(chain.label).toBe('hardhat')
    expect(chain.provider).toBe(provider)
  })

  it('can attach to a deployed contract', async () => {
    const contract = await ERC20()
    const {runner: {provider}, target: address, interface: iface} = contract
    const chainId = await provider.getNetwork().then(_ => _.chainId)
    const abi = iface.format()

    await coordinator.joinChain(provider)
    const deployed = coordinator.joinContract(chainId, address, abi)
    expect(deployed).toBe(coordinator.contractAt(chainId, address))

    // proving deployed contract is the original contract
    expect(await contract.balanceOf(account.address)).toEqual(0n)
    await deployed.connect(deployer).mint(account.address, 999n)
    expect(await contract.balanceOf(account.address)).toEqual(999n)
  })
})
