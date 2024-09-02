import {expect} from 'expect'
import {ContractWithLibraryModule} from '../ignition/ContractWithLibraryModule.js'
import {ignition} from './hardhat.js'

describe('ContractWithLibrary', () => {
  it('should deploy the contract and the library succesfully', async () => {
    const {contractWithLibrary} = await ignition.deploy(ContractWithLibraryModule)
    expect(await contractWithLibrary.readonlyFunction(1)).toEqual(3n)
    expect(await contractWithLibrary.readonlyFunction(3)).toEqual(5n)
  })
})
