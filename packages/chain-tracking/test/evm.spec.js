import {getCreationBlock, provider} from '@leverj/chain-deployment'
import {ERC20} from '@leverj/chain-tracking/test'
import {expect} from 'expect'

describe('evm', () => {
  it('getCreationBlock', async () => {
    const before = await provider.getBlockNumber()
    for (let i = 1; i <= 3; i++) {
      const contract = await ERC20()
      expect(await getCreationBlock(provider, contract.target)).toEqual(before + i)
    }
  })
})
