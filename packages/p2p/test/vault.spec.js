import {expect} from 'expect'
import {createVault, provider} from './help/vault.js'


describe('vault contract', function () {

  it('should be able to deposit ether', async function () {
    const contract = await createVault()
    const amount = BigInt(1e+6)
    const toChain  = 10101
    await contract.depositEth(toChain, {value: amount})
    expect(await provider.getBalance(await contract.getAddress())).toEqual(amount)
  })
})