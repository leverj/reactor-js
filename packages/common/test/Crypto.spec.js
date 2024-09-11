import {expect} from 'expect'
import {Crypto, ETH, uint} from '@leverj/common'

describe('Crypto', () => {
  const aNumber = uint(Number.MAX_SAFE_INTEGER)
  const aCurrency = '0xA00000000000000000000000000000000000000A'

  it('formatAmount', () => {
    const aBigNumber = '90'.repeat(12)
    expect(Crypto.formatAmount(aBigNumber + '123456789123456789', 18, 8)).toEqual(`${aBigNumber}.12345678`)
    expect(Crypto.formatAmount(aBigNumber + '123000010123456789', 18, 8)).toEqual(`${aBigNumber}.12300001`)
    expect(Crypto.formatAmount(aBigNumber + '123000000123456789', 18, 8)).toEqual(`${aBigNumber}.123`)
    expect(Crypto.formatAmount(aBigNumber + '000000000123456789', 18, 8)).toEqual(aBigNumber)
    expect(Crypto.formatAmount(aBigNumber + '000000000000000000', 18, 8)).toEqual(aBigNumber)
    expect(Crypto.formatAmount(0, 18, 8)).toEqual('0')
    expect(Crypto.formatAmount(undefined, 18, 8)).toEqual('0')
    expect(Crypto.formatAmount(null, 18, 8)).toEqual('0')
  })

  it('isNative', () => {
    expect(Crypto.Native(aNumber).isNative()).toBe(true)
    expect(Crypto.Zero(ETH).isNative()).toBe(true)
    expect(new Crypto(aNumber, aCurrency).isNative()).toBe(false)
    expect(Crypto.Zero(aCurrency).isNative()).toBe(false)
  })

  it('isZero', () => {
    expect(Crypto.Zero(ETH).isZero()).toBe(true)
    expect(Crypto.Native(aNumber).isZero()).toBe(false)
    expect(Crypto.Zero(aCurrency).isZero()).toBe(true)
    expect(new Crypto(aNumber, aCurrency).isZero()).toBe(false)
  })

  it('isEqualTo', () => {
    expect(Crypto.Zero(ETH).isEqualTo(Crypto.Native(0))).toBe(true)
    expect(Crypto.Zero(ETH).isEqualTo(Crypto.Native(aNumber))).toBe(false)
    expect(Crypto.Native(3).isEqualTo(Crypto.Native(2).plus(Crypto.Native(1)).plus(Crypto.Native(0)))).toBe(true)
  })

  it('isGreaterThan', () => {
    expect(Crypto.Native(1).isGreaterThan(Crypto.Native(0))).toBe(true)
    expect(Crypto.Native(1).isGreaterThan(Crypto.Native(1))).toBe(false)
    expect(Crypto.Native(1).isGreaterThan(Crypto.Native(9))).toBe(false)
  })

  it('arithmetics', () => {
    expect(Crypto.Native(2).plus(Crypto.Native(1)).isEqualTo(Crypto.Native(3))).toBe(true)
    expect(Crypto.Native(3).minus(Crypto.Native(1)).isEqualTo(Crypto.Native(2))).toBe(true)
    expect(Crypto.Native(3).multipliedBy(2).isEqualTo(Crypto.Native(6))).toBe(true)
    expect(Crypto.Native(6).dividedBy(2).isEqualTo(Crypto.Native(3))).toBe(true)
  })

  it('toBSON', () => {
    expect(new Crypto(aNumber, aCurrency).toBSON()).toMatchObject({
      amount: Number.MAX_SAFE_INTEGER.toString(),
      currency: aCurrency,
    })
  })
})
