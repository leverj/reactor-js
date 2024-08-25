import {ERC20, ethers, evm, getSigners} from '@leverj/reactor.chain/test'
import {Tracker, TrackerMarker} from '@leverj/reactor.chain/tracking'
import {expect} from 'expect'
import {setTimeout} from 'node:timers/promises'
import {InMemoryStore} from '../help.js'

const [deployer, account] = await getSigners()

describe('Tracker', () => {
  let contract, tracker, logs

  beforeEach(async () => {
    logs = []
    contract = await ERC20()
    const Approval = contract.filters.Approval().fragment.topicHash
    const Transfer = contract.filters.Transfer().fragment.topicHash
    const topics = [Approval, Transfer]
    const polling = {interval: 10, attempts: 5}
    const marker = TrackerMarker.of(new InMemoryStore(), evm.chainId)
    const processLog = _ => logs.push(_)
    tracker = new Tracker(contract, topics, polling, marker, processLog)
  })
  afterEach(() => tracker.stop())

  it('can track events when polling', async () => {
    expect(logs).toHaveLength(0)

    await contract.mint(account.address, 1000n) // => Transfer(from, to, value)
    await tracker.poll()
    expect(logs).toHaveLength(1)
    {
      const {name, args: {from, to, value}} = logs[0]
      expect(name).toEqual('Transfer')
      expect({from, to, value}).toMatchObject({from: ethers.ZeroAddress, to: account.address, value: 1000n})
    }

    await contract.mint(account.address, 2000n) // => Transfer(from, to, value)
    await contract.approve(contract.target, 5000n) // => Approval(owner, spender, value)
    await tracker.poll()
    expect(logs).toHaveLength(3)
    {
      const {name, args: {from, to, value}} = logs[1]
      expect(name).toEqual('Transfer')
      expect({from, to, value}).toMatchObject({from: ethers.ZeroAddress, to: account.address, value: 2000n})
    }
    {
      const {name, args: {owner, spender, value}} = logs[2]
      expect(name).toEqual('Approval')
      expect({owner, spender, value}).toMatchObject({owner: deployer.address, spender: contract.target, value: 5000n})
    }
  })

  it('can catchup with events after start', async () => {
    await contract.mint(account.address, 1000n) // => Transfer(from, to, value)
    await contract.approve(contract.target, 5000n) // => Approval(owner, spender, value)
    await contract.mint(account.address, 2000n) // => Transfer(from, to, value)
    await tracker.start()
    await setTimeout(100)
    expect(logs).toHaveLength(3)
    {
      const {name, args: {from, to, value}} = logs[0]
      expect(name).toEqual('Transfer')
      expect({from, to, value}).toMatchObject({from: ethers.ZeroAddress, to: account.address, value: 1000n})
    }
    {
      const {name, args: {owner, spender, value}} = logs[1]
      expect(name).toEqual('Approval')
      expect({owner, spender, value}).toMatchObject({owner: deployer.address, spender: contract.target, value: 5000n})
    }
    {
      const {name, args: {from, to, value}} = logs[2]
      expect(name).toEqual('Transfer')
      expect({from, to, value}).toMatchObject({from: ethers.ZeroAddress, to: account.address, value: 2000n})
    }
  })
})
