import {expect} from 'expect'
import {ReceivesEthModule} from '../ignition/ReceivesEthModule.js'
import {ignition, provider} from './hardhat.js'

describe.skip('ReceivesEth', () => {
  it('should deploy the contract and send it eth', async () => {
    const {receivesEth} = await ignition.deploy(ReceivesEthModule)
    expect(await provider.getBalance(receivesEth)).toEqual(await receivesEth.amount())
  })
})
