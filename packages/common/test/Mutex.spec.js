import {expect} from 'expect'
import {CapturingLogger, Mutex} from '@leverj/common'

describe('Mutex', () => {
  const task1 = async (array) => { await array.push(1); await array.push(2) }
  const task2 = async (array) => { await array.push(3); await array.push(4) }
  const task3 = async (array) => { await array.concat(123, 34, 4); throw Error('This function is bad') }

  it('should not run task in sequence if run in parallel', async () => {
    const populatedList = []
    await Promise.all([task1(populatedList), task2(populatedList)])
    expect(populatedList).toEqual([1, 3, 2, 4])
  })

  it('should able to run 2 jobs in sequence', async () => {
    const mutex = new Mutex()
    const populatedList = []
    await Promise.all([mutex.synchronize(() => task1(populatedList)), mutex.synchronize(() => task2(populatedList))])
    expect(populatedList).toEqual([1, 2, 3, 4])
  })

  it('should able to run 2 jobs in sequence even if one of the three tasks throws an error', async () => {
    const logger = new CapturingLogger()
    const mutex = new Mutex()
    const populatedList = []
    await Promise.all([
      mutex.synchronize(() => task1(populatedList)),
      mutex.synchronize(() => task3(populatedList)),
      mutex.synchronize(() => task2(populatedList))
    ]).catch(e => logger.error(e))
    expect(populatedList).toEqual([1, 2, 3, 4])
  })

})
