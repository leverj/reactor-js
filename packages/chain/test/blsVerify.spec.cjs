const {ethers:{deployContract, getContractFactory, getSigners}}  = require('hardhat')
const {expect} = require('expect')

describe('dlsVerify', () => {
  let contract, owner, anyone

  beforeEach(async () => {
    [owner, anyone] = await getSigners()

  })

  describe('verify', () => {
    it('should verify name', async () => {
      let someName = 'some name'
      contract = await deployContract('BlsVerify', [someName])
      const verified = await contract.verify()
      expect(verified).toEqual(someName)
    })
  })
})
