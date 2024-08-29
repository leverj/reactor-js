import {MultiChainContractCoordinator} from '@leverj/chain-tracking'
import {chainId, ERC20, getSigners, provider} from '@leverj/chain-tracking/test'
import {expect} from 'expect'

const [deployer, account] = await getSigners()

describe('MultiChainContractCoordinator', () => {
  const coordinator = new MultiChainContractCoordinator()

  beforeEach(() => coordinator.start())
  afterEach(() => coordinator.stop())

  it('can join a chain', async () => {
    await coordinator.joinChain(provider)
    const chain = coordinator.chain(chainId)
    expect(chain.name).toBe('hardhat')
    expect(chain.provider).toBe(provider)
    expect(chain.chainId).toBe(chainId)
  })

  it('can attach to a deployed contract', async () => {
    const contract = await ERC20()
    const {runner: {provider}, target: address, interface: iface} = contract
    await coordinator.joinChain(provider)
    const deployed = coordinator.joinContract((await provider.getNetwork()).chainId, address, iface.format())
    console.log('>'.repeat(5), deployed.target)
    // expect(deployed).toEqual(contract)
  })
})
