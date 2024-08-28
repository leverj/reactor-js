import {InMemoryStore, MultiContractTracker} from '@leverj/chain-tracking'
import {
  chainId,
  ERC20,
  ERC721,
  expectEventsToMatch,
  getSigners,
  provider,
  ZeroAddress,
} from '@leverj/chain-tracking/test'
import {logger} from '@leverj/common/utils'
import {setTimeout} from 'node:timers/promises'

const [deployer, account] = await getSigners()

describe('MultiContractTracker', () => {
  let tracker, events

  beforeEach(async () => {
    events = []
    const polling = {interval: 10, attempts: 5}
    tracker = MultiContractTracker.from(new InMemoryStore(), chainId, provider, polling, _ => events.push(_), logger)
  })
  afterEach(() => tracker.stop())

  describe('single kind / single contract', () => {
    it('handles adding contract and emitting events after tracker starts (only on-going; no catch-up)', async () => {
      await tracker.start()

      const contract = await ERC20(), address = contract.target
      await tracker.addContract(contract, 'ERC20')
      await contract.mint(account.address, 1000n)
      await contract.approve(contract.target, 5000n)
      await contract.mint(account.address, 2000n)
      await setTimeout(10)
      expectEventsToMatch(events, [
        {address, name: 'Transfer', args: [ZeroAddress, account.address, 1000n]},
        {address, name: 'Approval', args: [deployer.address, contract.target, 5000n]},
        {address, name: 'Transfer', args: [ZeroAddress, account.address, 2000n]},
      ])
    })
  })

  describe('single kind / multiple contracts', () => {
    it('handles adding contract and emitting events before tracker starts (only catch-up; no on-going)', async () => {
      const contract1 = await ERC20('One', '111'), address1 = contract1.target
      const contract2 = await ERC20('Two', '222'), address2 = contract2.target

      await contract1.mint(account.address, 100n)
      await contract2.mint(account.address, 200n)
      await contract1.approve(contract1.target, 10000n)
      await contract1.mint(account.address, 2000n)
      await contract2.approve(contract2.target, 20000n)
      await contract2.mint(account.address, 4000n)

      await tracker.start()
      await tracker.addContract(contract1, 'ERC20') // => will onboard
      await tracker.addContract(contract2, 'ERC20') // => will onboard
      await setTimeout(10)
      expectEventsToMatch(events, [
        {address: address1, name: 'Transfer', args: [ZeroAddress, account.address, 100n]},
        {address: address1, name: 'Approval', args: [deployer.address, contract1.target, 10000n]},
        {address: address1, name: 'Transfer', args: [ZeroAddress, account.address, 2000n]},
        {address: address2, name: 'Transfer', args: [ZeroAddress, account.address, 200n]},
        {address: address2, name: 'Approval', args: [deployer.address, contract2.target, 20000n]},
        {address: address2, name: 'Transfer', args: [ZeroAddress, account.address, 4000n]},
      ])
    })
  })

  describe('multiple kinds / multiple contracts', () => {
    it('handles adding contract and emitting events before & after tracker starts (catch-up & on-going)', async () => {
      const contract1 = await ERC20('One', '111'), address1 = contract1.target
      const contract2 = await ERC20('Two', '222'), address2 = contract2.target
      const contract3 = await ERC721('Three', '333'), address3 = contract3.target

      await contract1.mint(account.address, 100n)
      await contract2.mint(account.address, 200n)
      await contract1.approve(contract1.target, 10000n)

      await tracker.addContract(contract1, 'ERC20')
      await setTimeout(10)
      expectEventsToMatch(events, [])

      await tracker.start()
      await setTimeout(10)
      expectEventsToMatch(events, [
        {address: address1, name: 'Transfer', args: [ZeroAddress, account.address, 100n]},
        {address: address1, name: 'Approval', args: [deployer.address, contract1.target, 10000n]},
      ])

      await tracker.addContract(contract2, 'ERC20')
      await setTimeout(10)
      expectEventsToMatch(events, [
        {address: address1, name: 'Transfer', args: [ZeroAddress, account.address, 100n]},
        {address: address1, name: 'Approval', args: [deployer.address, contract1.target, 10000n]},
        {address: address2, name: 'Transfer', args: [ZeroAddress, account.address, 200n]},
      ])

      await contract1.mint(account.address, 2000n)
      await contract2.approve(contract2.target, 20000n)
      await contract3.mint(account.address, 3n)
      await setTimeout(10)
      expectEventsToMatch(events, [
        {address: address1, name: 'Transfer', args: [ZeroAddress, account.address, 100n]},
        {address: address1, name: 'Approval', args: [deployer.address, contract1.target, 10000n]},
        {address: address2, name: 'Transfer', args: [ZeroAddress, account.address, 200n]},
        {address: address1, name: 'Transfer', args: [ZeroAddress, account.address, 2000n]},
        {address: address2, name: 'Approval', args: [deployer.address, contract2.target, 20000n]},
      ])

      await tracker.addContract(contract3, 'ERC721')
      await contract2.mint(account.address, 4000n)
      await contract3.connect(account).approve(contract1.target, 3n)
      await contract3.mint(account.address, 6n)
      await setTimeout(10)
      expectEventsToMatch(events, [
        {address: address1, name: 'Transfer', args: [ZeroAddress, account.address, 100n]},
        {address: address1, name: 'Approval', args: [deployer.address, contract1.target, 10000n]},
        {address: address2, name: 'Transfer', args: [ZeroAddress, account.address, 200n]},
        {address: address1, name: 'Transfer', args: [ZeroAddress, account.address, 2000n]},
        {address: address2, name: 'Approval', args: [deployer.address, contract2.target, 20000n]},
        {address: address3, name: 'Transfer', args: [ZeroAddress, account.address, 3n]},
        {address: address2, name: 'Transfer', args: [ZeroAddress, account.address, 4000n]},
        {address: address3, name: 'Approval', args: [account.address, contract1.target, 3n]},
        {address: address3, name: 'Transfer', args: [ZeroAddress, account.address, 6n]},
      ])
    })
  })
})
