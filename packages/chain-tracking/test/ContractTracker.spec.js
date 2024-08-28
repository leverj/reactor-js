import {InMemoryStore, ContractTracker} from '@leverj/chain-tracking'
import {chainId, ERC20, expectEventsToMatch, getSigners, ZeroAddress} from '@leverj/chain-tracking/test'
import {logger} from '@leverj/common/utils'
import {setTimeout} from 'node:timers/promises'

const [deployer, account] = await getSigners()

describe('ContractTracker', () => {
  let contract, tracker, events

  beforeEach(async () => {
    events = []
    contract = await ERC20()
    const {filters, target: address, runner: {provider}} = contract
    const topics = [filters.Approval().fragment.topicHash, filters.Transfer().fragment.topicHash]
    const defaults = {contract, topics}
    const polling = {interval: 10, attempts: 5}
    tracker = ContractTracker.from(new InMemoryStore(), chainId, address, provider, defaults, polling, _ => _, logger)
  })
  afterEach(() => tracker.stop())

  it('can track events when polling', async () => {
    const address = contract.target
    expectEventsToMatch(events, [])

    await contract.mint(account.address, 1000n) // => Transfer(from, to, value)
    await tracker.poll()
    expectEventsToMatch(events, [
      {address, name: 'Transfer', args: [ZeroAddress, account.address, 1000n]},
    ])

    await contract.mint(account.address, 2000n) // => Transfer(from, to, value)
    await contract.approve(contract.target, 5000n) // => Approval(owner, spender, value)
    await tracker.poll()
    expectEventsToMatch(events, [
      {address, name: 'Transfer', args: [ZeroAddress, account.address, 1000n]},
      {address, name: 'Transfer', args: [ZeroAddress, account.address, 2000n]},
      {address, name: 'Approval', args: [deployer.address, contract.target, 5000n]},
    ])
  })

  it('can catchup with events after start', async () => {
    const address = contract.target
    await contract.mint(account.address, 1000n) // => Transfer(from, to, value)
    await contract.approve(contract.target, 5000n) // => Approval(owner, spender, value)
    await contract.mint(account.address, 2000n) // => Transfer(from, to, value)
    await tracker.start()
    await setTimeout(10)
    expectEventsToMatch(events, [
      {address, name: 'Transfer', args: [ZeroAddress, account.address, 1000n]},
      {address, name: 'Approval', args: [deployer.address, contract.target, 5000n]},
      {address, name: 'Transfer', args: [ZeroAddress, account.address, 2000n]},
    ])
  })
})
