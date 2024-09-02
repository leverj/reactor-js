import {expect} from 'expect'
import {DeploymentPlusInitializationModule} from '../ignition/DeploymentPlusInitializationModule.js'
import {ignition} from './hardhat.js'

describe.skip('DeploymentPlusInitialization', () => {
  it('should deploy the contract and call its initialize function', async () => {
    const {helloWorld} = await ignition.deploy(DeploymentPlusInitializationModule)
    expect(await helloWorld.message()).toEqual('Hello, world!')
  })
})
