import {expect} from 'expect'
import {deployContract} from './hardhat.js'

describe('Greeter', () => {
  let contract

  beforeEach(async () => contract = await deployContract('Greeter', []))

  describe('sum', () => {
    it('should return 5 when given parameters are 2 and 3', async () => {
      const sum = await contract.sum(2, 3)
      expect(sum).toEqual(5n)
    })
  })

  describe('getMyLuckyNumber', () => {
    it('should return 5 when given 5', async () => {
      await contract.saveLuckyNumber(5)
      const myLuckyNumber = await contract.getMyLuckyNumber()
      expect(myLuckyNumber).toEqual(5n)
    })
  })

  describe('saveLuckyNumber', () => {
    it('should revert with message \'Lucky number should not be 0.\', when given 0', async () => {
      await expect(() => contract.saveLuckyNumber(0)).rejects.toThrow(/Lucky number should not be 0/)
    })

    it('should revert with message \'You already have a lucky number.\', when owner already have saved a lucky number', async () => {
      await contract.saveLuckyNumber(6)
      await expect(() => contract.saveLuckyNumber(7)).rejects.toThrow(/You already have a lucky number/)
    })

    it('should retrieve 66 when recently given lucky number is 66', async () => {
      await contract.saveLuckyNumber(66)
      const storedLuckyNumber = await contract.getMyLuckyNumber()
      expect(storedLuckyNumber).toEqual(66n)
    })
  })

  describe('updateLuckyNumber', () => {
    it('should revert with message \'\', when the given lucky number does not match with their existing lucky number', async () => {
      await contract.saveLuckyNumber(6)
      await expect(() => contract.updateLuckyNumber(8, 99)).rejects.toThrow(/Not your previous lucky number/)
    })

    it('should update their lucky number, when given the exact existing lucky number stored', async () => {
      await contract.saveLuckyNumber(2)
      await contract.updateLuckyNumber(2, 22)
      const newLuckyNumber = await contract.getMyLuckyNumber()
      expect(newLuckyNumber).toEqual(22n)
    })
  })
})
