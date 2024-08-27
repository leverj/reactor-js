import {logger} from '@leverj/common/utils'
import {MultiTracker, TrackerMarkerFactory} from '@leverj/chain-tracking'
import {expect} from 'expect'
import * as hardhat from 'hardhat'
import {setTimeout} from 'node:timers/promises'
import {InMemoryStore} from './help.js'

const {ethers: {deployContract, getSigners, provider, ZeroAddress}, network: {config: {chainId}}} = hardhat.default
const [deployer, account] = await getSigners()

describe('MultiTracker', () => {
  let tracker, logs

  beforeEach(async () => {
    logs = []
    const factory = TrackerMarkerFactory(new InMemoryStore(), chainId)
    const polling = {interval: 10, attempts: 5}
    const processLog = _ => logs.push(_)
    tracker = await MultiTracker.from(factory, provider, polling, processLog, logger)
  })
  afterEach(() => tracker.stop())

  describe('single kind / single contract', () => {
    it('adding contract and emitting events after tracker starts (only on-going; no catch-up)', async () => {
      await tracker.start()

      const contract = await deployContract('ERC20Mock', ['Crap', 'CRAP'])
      tracker.addContract(contract, 'ERC20')
      await contract.mint(account.address, 1000n)
      await contract.approve(contract.target, 5000n)
      await contract.mint(account.address, 2000n)
      await setTimeout(100)

      const expected = [
        {name: 'Transfer', args: [ZeroAddress, account.address, 1000n]},
        {name: 'Approval', args: [deployer.address, contract.target, 5000n]},
        {name: 'Transfer', args: [ZeroAddress, account.address, 2000n]},
      ]
      for (let [i, {name, args}] of logs.entries()) {
        expect(name).toEqual(expected[i].name)
        expect(args).toMatchObject(expected[i].args)
      }
    })
  })

  describe('single kind / multiple contracts', () => {
    it('adding contract and emitting events before tracker starts (only catch-up; no on-going)', async () => {
      const contract1 = await deployContract('ERC20Mock', ['One', '111'])
      const contract2 = await deployContract('ERC20Mock', ['Two', '222'])

      await contract1.mint(account.address, 100n)
      await contract2.mint(account.address, 200n)
      await contract1.approve(contract1.target, 10000n)
      await contract2.approve(contract2.target, 20000n)
      await contract1.mint(account.address, 2000n)
      await contract2.mint(account.address, 4000n)

      await tracker.start()
      tracker.addContract(contract1, 'ERC20')
      tracker.addContract(contract2, 'ERC20')
      await setTimeout(100)

      const expected = [
        {name: 'Transfer', args: [ZeroAddress, account.address, 100n]},
        {name: 'Transfer', args: [ZeroAddress, account.address, 200n]},
        {name: 'Approval', args: [deployer.address, contract1.target, 10000n]},
        {name: 'Approval', args: [deployer.address, contract2.target, 20000n]},
        {name: 'Transfer', args: [ZeroAddress, account.address, 2000n]},
        {name: 'Transfer', args: [ZeroAddress, account.address, 4000n]},
      ]
      for (let [i, {name, args}] of logs.entries()) {
        expect(name).toEqual(expected[i].name)
        expect(args).toMatchObject(expected[i].args)
      }
    })
  })

  describe.skip('multiple kinds / multiple contracts', () => {
    it('adding contract and emitting events before tracker starts (only catch-up; no on-going)', async () => {
      const contract1 = await deployContract('ERC20Mock', ['One', '111'])
      const contract2 = await deployContract('ERC20Mock', ['Two', '222'])
      const contract3 = await deployContract('ERC20Mock', ['Three', '333'])


      await tracker.start()
      tracker.addContract(contract1, 'ERC20')
      await setTimeout(100)

      tracker.addContract(contract2, 'ERC20')
      await setTimeout(100)

      tracker.addContract(contract3, 'ERC20')
      await setTimeout(100)

      const expected = [
      ]
      for (let [i, {name, args}] of logs.entries()) {
        expect(name).toEqual(expected[i].name)
        expect(args).toMatchObject(expected[i].args)
      }
    })
  })
})
