import {expect} from 'expect'
import {BasicDeploymentsModule} from '../ignition/BasicDeploymentsModule.js'
import {ignition} from './hardhat.js'

describe('BasicDeployments', () => {
  it('should deploy the contracts', async () => {
    // This is how you deploy a module and access its exposed contracts, which are ethers.js contract objects.
    const {helloWorld, wrappedHelloWorld, holaMundo} = await ignition.deploy(BasicDeploymentsModule)
    expect(await helloWorld.message()).toEqual('Hello, world!')
    expect(await wrappedHelloWorld.message()).toEqual('Hello, world!')
    expect(await holaMundo.message()).toEqual('Hola, mundo!')
  })
})
