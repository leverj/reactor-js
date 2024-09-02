import {expect} from 'expect'
import {ContractFactoryModule} from '../ignition/ContractFactoryModule.js'
import {ignition} from './hardhat.js'

describe('ContractFactory', () => {
  it('should deploy the contract and increase the factory\'s nextId', async () => {
    const {factory, deployedWithFactory} = await ignition.deploy(ContractFactoryModule)
    expect(await deployedWithFactory.id()).toEqual(0n)
    expect(await factory.nextId()).toEqual(1n)
  })
})
