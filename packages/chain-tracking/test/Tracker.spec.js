import {logger} from '@leverj/common/utils'
import {InMemoryStore, Tracker, TrackerMarkerFactory} from '@leverj/chain-tracking'
import * as hardhat from 'hardhat'
import {setTimeout} from 'node:timers/promises'
import {expectEventsToBe} from './help.js'

const {ethers: {deployContract, getSigners, ZeroAddress}, network: {config: {chainId}}} = hardhat.default
const [deployer, account] = await getSigners()

describe('Tracker', () => {
  let contract, tracker, events

  beforeEach(async () => {
    events = []
    const factory = TrackerMarkerFactory(new InMemoryStore(), chainId)
    contract = await deployContract('ERC20Mock', ['Crap', 'CRAP'])
    const Approval = contract.filters.Approval().fragment.topicHash
    const Transfer = contract.filters.Transfer().fragment.topicHash
    const topics = [Approval, Transfer]
    const polling = {interval: 10, attempts: 5}
    tracker = await Tracker.from(factory, contract, topics, polling, _ => events.push(_), logger)
  })
  afterEach(() => tracker.stop())

  it('can track events when polling', async () => {
    const address = contract.target
    expectEventsToBe(events, [])

    await contract.mint(account.address, 1000n) // => Transfer(from, to, value)
    await tracker.poll()
    expectEventsToBe(events, [
      {address, name: 'Transfer', args: [ZeroAddress, account.address, 1000n]},
    ])

    await contract.mint(account.address, 2000n) // => Transfer(from, to, value)
    await contract.approve(contract.target, 5000n) // => Approval(owner, spender, value)
    await tracker.poll()
    expectEventsToBe(events, [
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

    expectEventsToBe(events, [
      {address, name: 'Transfer', args: [ZeroAddress, account.address, 1000n]},
      {address, name: 'Approval', args: [deployer.address, contract.target, 5000n]},
      {address, name: 'Transfer', args: [ZeroAddress, account.address, 2000n]},
    ])
  })
})
