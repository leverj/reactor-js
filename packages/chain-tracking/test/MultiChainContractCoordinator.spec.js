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
    {
      const chainId = await provider.getNetwork().then(_ => _.chainId)
      const deployed = coordinator.joinContract(chainId, address, iface.format())
      expect(deployed).toBe(coordinator.contract(chainId, address))

      // prove deployed is the original contract
      expect(await contract.balanceOf(account.address)).toEqual(0n)
      await deployed.connect(deployer).mint(account.address, 999n)
      expect(await contract.balanceOf(account.address)).toEqual(999n)
    }
  })
})
