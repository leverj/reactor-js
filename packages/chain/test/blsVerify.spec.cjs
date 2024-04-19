const {ethers:{deployContract, getContractFactory, getSigners}}  = require('hardhat')
const {expect} = require('expect')
const {fromHexString, toHexString} = require('@chainsafe/ssz')
const BigNumber = require('bignumber.js')

describe('dlsVerify', () => {
  let contract, owner, anyone

  beforeEach(async () => {
    [owner, anyone] = await getSigners()

  })

  describe('verify', () => {
    it('should verify name', async () => {
      contract = await deployContract('BlsVerify', [])
      const groupsSign =  '0x50d128055e103463979742916a1073899ce06108e1fe802f202c8daeb1f63408'
      const message =  'hello world'
      const publicKey  = '0xfc9f1b02cab189120e0e8d77c75b6e4e833f942060806736d50f752f4e4348147e0104c15e9404c4c33bc5694bc1367ad893266d8fac944be98eb5332aae051b'
      console.log('groupsSign', BigNumber(groupsSign).toFixed())
      console.log('publicKey', BigNumber(publicKey).toFixed())
      const verified = await contract.verify([1,2], [1,2,3,4], [1,2])
      console.log('verified', verified)
      expect(verified).toEqual(true)
    })
    it.only('should run BGLS', async () => {
      contract = await deployContract('BLSExample', [])
      await contract.verifyBLSTest()
      const verified = await contract.result()
      console.log('BLSTest', verified)
      expect(verified).toEqual(true)
      
    })
  })
})
