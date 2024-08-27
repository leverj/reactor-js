import {logger} from '@leverj/common/utils'
import {MultiTracker, TrackerMarkerFactory} from '@leverj/chain-tracking'
import * as hardhat from 'hardhat'
import {setTimeout} from 'node:timers/promises'
import {expectEventsToBe, InMemoryStore} from './help.js'

const {ethers: {deployContract, getSigners, provider, ZeroAddress}, network: {config: {chainId}}} = hardhat.default
const [deployer, account] = await getSigners()

describe('MultiTracker', () => {
  let tracker, events

  beforeEach(async () => {
    events = []
    const factory = TrackerMarkerFactory(new InMemoryStore(), chainId)
    const polling = {interval: 10, attempts: 5}
    const processLog = _ => events.push(_)
    tracker = await MultiTracker.from(factory, provider, polling, processLog, logger)
  })
  afterEach(() => tracker.stop())

  describe('single kind / single contract', () => {
    it('adding contract and emitting events after tracker starts (only on-going; no catch-up)', async () => {
      await tracker.start()

      const contract = await deployContract('ERC20Mock', ['Crap', 'CRAP']), address = contract.target
      tracker.addContract(contract, 'ERC20')
      await contract.mint(account.address, 1000n)
      await contract.approve(contract.target, 5000n)
      await contract.mint(account.address, 2000n)
      await setTimeout(100)

      expectEventsToBe(events, [
        {address, name: 'Transfer', args: [ZeroAddress, account.address, 1000n]},
        {address, name: 'Approval', args: [deployer.address, contract.target, 5000n]},
        {address, name: 'Transfer', args: [ZeroAddress, account.address, 2000n]},
      ])
    })
  })

  describe('single kind / multiple contracts', () => {
    it('adding contract and emitting events before tracker starts (only catch-up; no on-going)', async () => {
      const contract1 = await deployContract('ERC20Mock', ['One', '111']), address1 = contract1.target
      const contract2 = await deployContract('ERC20Mock', ['Two', '222']), address2 = contract2.target

      await contract1.mint(account.address, 100n)
      await contract2.mint(account.address, 200n)
      await contract1.approve(contract1.target, 10000n)
      await contract1.mint(account.address, 2000n)
      await contract2.approve(contract2.target, 20000n)
      await contract2.mint(account.address, 4000n)

      await tracker.start()
      tracker.addContract(contract1, 'ERC20')
      tracker.addContract(contract2, 'ERC20')
      await setTimeout(100)

      expectEventsToBe(events, [
        {address: address1, name: 'Transfer', args: [ZeroAddress, account.address, 100n]},
        {address: address2, name: 'Transfer', args: [ZeroAddress, account.address, 200n]},
        {address: address1, name: 'Approval', args: [deployer.address, contract1.target, 10000n]},
        {address: address1, name: 'Transfer', args: [ZeroAddress, account.address, 2000n]},
        {address: address2, name: 'Approval', args: [deployer.address, contract2.target, 20000n]},
        {address: address2, name: 'Transfer', args: [ZeroAddress, account.address, 4000n]},
      ])
    })
  })

  describe('multiple kinds / multiple contracts', () => {
    it.only('adding contract and emitting events before & after tracker starts (catch-up & on-going)', async () => {
      const contract1 = await deployContract('ERC20Mock', ['One', '111']), address1 = contract1.target
      const contract2 = await deployContract('ERC20Mock', ['Two', '222']), address2 = contract2.target
      const contract3 = await deployContract('ERC721Mock', ['Three', '333']), address3 = contract3.target

      await contract1.mint(account.address, 100n)
      await contract2.mint(account.address, 200n)
      await contract1.approve(contract1.target, 10000n)

      tracker.addContract(contract1, 'ERC20')
      await setTimeout(100)
      expectEventsToBe(events, [])
      return

      await tracker.start()
      await setTimeout(100)
      expectEventsToBe(events, [
        {address: address1, name: 'Transfer', args: [ZeroAddress, account.address, 100n]},
        {address: address1, name: 'Approval', args: [deployer.address, contract1.target, 10000n]},
      ])
      return

      tracker.addContract(contract2, 'ERC20')
      await setTimeout(100)
      expectEventsToBe(events, [
        {address: address1, name: 'Transfer', args: [ZeroAddress, account.address, 100n]},
        {address: address1, name: 'Approval', args: [deployer.address, contract1.target, 10000n]},
        {address: address2, name: 'Transfer', args: [ZeroAddress, account.address, 200n]},
      ])
      return

      await contract1.mint(account.address, 2000n)
      await contract2.approve(contract2.target, 20000n)
      await contract3.mint(account.address, 3n)
      await setTimeout(100)
      expectEventsToBe(events, [
        {address: address1, name: 'Transfer', args: [ZeroAddress, account.address, 100n]},
        {address: address1, name: 'Approval', args: [deployer.address, contract1.target, 10000n]},
        {address: address2, name: 'Transfer', args: [ZeroAddress, account.address, 200n]},
        {address: address1, name: 'Transfer', args: [ZeroAddress, account.address, 2000n]},
        {address: address2, name: 'Approval', args: [deployer.address, contract2.target, 20000n]},
      ])
      return

      tracker.addContract(contract3, 'ERC721')
      await contract2.mint(account.address, 4000n)
      await contract3.connect(account).approve(contract1.target, 3n)
      await contract3.mint(account.address, 6n)
      await setTimeout(100)
      expectEventsToBe(events, [
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
