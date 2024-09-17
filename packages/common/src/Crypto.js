import {FixedNumber, getAddress, ZeroAddress as Native} from 'ethers'

export class Crypto {
  static Native(amount) { return new this(amount, Native) }
  static Zero(currency) { return new this(0, currency) }

  static formatAmount(amount, decimals, fractionDigits) {
    const fixed = FixedNumber.fromValue(amount || '0', decimals, `fixed256x${decimals}`).toString()
    const [left, right] = fixed.split('.')
    const fraction = right.substring(0, fractionDigits)
    return parseInt(fraction) === 0 ? left : `${left}.${fraction}`.replace(/0+$/, '')
  }

  constructor(amount, currency) {
    this.amount = BigInt(amount)
    this.currency = getAddress(currency)
  }

  isNative() { return this.currency === Native }
  isZero() { return this.amount === 0n }
  isEqualTo(other) { return this.currency === other.currency && this.amount == BigInt(other.amount) }
  isGreaterThan(other) { return this.currency === other.currency && this.amount > BigInt(other.amount) }
  plus(other) { return new Crypto(this.amount + BigInt(other.amount), this.currency) }
  minus(other) { return new Crypto(this.amount - BigInt(other.amount), this.currency) }
  multipliedBy(value) { return new Crypto(this.amount * BigInt(value), this.currency) }
  dividedBy(value) { return new Crypto(this.amount / BigInt(value), this.currency) }

  asStructForEthers() {
    return {
      amount: this.amount,
      currency: this.currency
    }
  }

  toBSON() {
    return {
      amount: this.amount.toString(),
      currency: this.currency
    }
  }
}
