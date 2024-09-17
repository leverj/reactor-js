import {expect} from 'expect'
import {affirm, affirmExists} from '@leverj/common'

describe('affirm', () => {
  it('should pass', () => {
    expect(() => affirm(true, 'should pass')).not.toThrow()
    expect(() => affirm(true, 'should pass')).not.toThrow()
  })

  it('should fail', () => {
    expect(() => affirm(false, 'should fail')).toThrow(/should fail/)
  })

  it('should fail with status', () => {
    try {
      affirm(false, 'should fail', 400)
      fail()
    } catch (e) {
      expect(e.statusCode).toBe(400)
    }
  })

  it('should fail if one of the fiend is undefined', () => {
    try {
      affirmExists({
        a: 0,
        b: 'something',
        c: undefined
      })
      fail()
    } catch (e) {
      expect(e.message).toEqual('c missing')
    }
  })
})
