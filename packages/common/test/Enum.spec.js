import {expect} from 'expect'
import randomhex from 'randomhex'
import {Enum} from '@leverj/common'

describe('Enum', () => {
  describe('of numbers', () => {
    const SomeType = Enum.of({zero: 0, one: 1})
    const missing = 10

    it('can check for membership by value', () => {
      expect(SomeType.hasValue(1)).toBe(true)
      expect(SomeType.hasValue(missing)).toBe(false)
    })

    it('can check for membership by name', () => {
      expect(SomeType.hasName('one')).toBe(true)
      expect(SomeType.hasName('whatever')).toBe(false)
    })

    it('can find name of value', () => {
      expect(SomeType.nameOf(1)).toBe('one')
      expect(SomeType.nameOf(missing)).toBe(undefined)
    })

    it('can access value by name', () => {
      expect(SomeType.valueOf('one')).toBe(1)
      expect(SomeType.valueOf('whatever')).toBe(undefined)
    })

    it('can access value directly', () => {
      expect(SomeType.one).toBe(1)
      expect(SomeType.whatever).toBe(undefined)
    })

    it('has inherent ordering', () => {
      expect(SomeType.ordinalOf(SomeType.one)).toBe(1)
      expect(SomeType.ordinalOf(SomeType.whatever)).toBe(-1)
    })

    it('can be converted to a map', () => {
      expect(SomeType.toMap().get('one')).toBe(1)
      expect(SomeType.toMap().get('whatever')).toBe(undefined)
    })

    it('can expand', () => {
      const ExtendedType = SomeType.expandWith({two: 2})

      // original Enum is unchanged
      expect(SomeType.values).toEqual([0,1])
      expect(ExtendedType.values).toEqual([0,1,2])
      expect(SomeType.names).toEqual(['zero','one'])
      expect(ExtendedType.names).toEqual(['zero','one', 'two'])

      // help member look like they're shared
      expect(ExtendedType.ordinalOf(SomeType.one)).toBe(1)
      expect(SomeType.ordinalOf(ExtendedType.one)).toBe(1)
      expect(SomeType.one).toBe(ExtendedType.one)

      expect(ExtendedType.ordinalOf(ExtendedType.two)).toBe(2)
      expect(SomeType.ordinalOf(ExtendedType.two)).toBe(-1)
    })
  })

  describe('of strings', () => {
    const SomeType = Enum.of({zero: '٠', one: '١'})
    const missing = '١٠'

    it('can check for membership by value', () => {
      expect(SomeType.hasValue('١')).toBe(true)
      expect(SomeType.hasValue(missing)).toBe(false)
    })

    it('can check for membership by name', () => {
      expect(SomeType.hasName('one')).toBe(true)
      expect(SomeType.hasName('whatever')).toBe(false)
    })

    it('can find name of value', () => {
      expect(SomeType.nameOf('١')).toBe('one')
      expect(SomeType.nameOf(missing)).toBe(undefined)
    })

    it('can access value by name', () => {
      expect(SomeType.valueOf('one')).toBe('١')
      expect(SomeType.valueOf('whatever')).toBe(undefined)
    })

    it('can access value directly', () => {
      expect(SomeType.one).toBe('١')
      expect(SomeType.whatever).toBe(undefined)
    })

    it('has inherent ordering', () => {
      expect(SomeType.ordinalOf(SomeType.one)).toBe(1)
      expect(SomeType.ordinalOf(SomeType.whatever)).toBe(-1)
    })

    it('can be converted to a map', () => {
      expect(SomeType.toMap().get('one')).toBe('١')
      expect(SomeType.toMap().get('whatever')).toBe(undefined)
    })
  })

  describe('of objects', () => {
    const registry = {
      空: { address: 'here', tokenSymbol: 'WHAT' },
      EVER: { address: 'there', tokenSymbol: 'EVER' },
    }
    const SomeType = Enum.of({zero: registry.空, one: registry.EVER})
    const missing = { address: randomhex(20), tokenSymbol: 'Unknown' }
    it('can check for membership by value', () => {
      expect(SomeType.hasValue(registry.EVER)).toBe(true)
      expect(SomeType.hasValue(missing)).toBe(false)
    })

    it('can check for membership by name', () => {
      expect(SomeType.hasName('one')).toBe(true)
      expect(SomeType.hasName('whatever')).toBe(false)
    })

    it('can find name of value', () => {
      expect(SomeType.nameOf(registry.EVER)).toBe('one')
      expect(SomeType.nameOf(missing)).toBe(undefined)
    })

    it('can access value by name', () => {
      expect(SomeType.valueOf('one')).toBe(registry.EVER)
      expect(SomeType.valueOf('whatever')).toBe(undefined)
    })

    it('can access value directly', () => {
      expect(SomeType.one).toBe(registry.EVER)
      expect(SomeType.whatever).toBe(undefined)
    })

    it('has inherent ordering', () => {
      expect(SomeType.ordinalOf(SomeType.one)).toBe(1)
      expect(SomeType.ordinalOf(SomeType.whatever)).toBe(-1)
    })

    it('can be converted to a map', () => {
      expect(SomeType.toMap().get('one')).toBe(registry.EVER)
      expect(SomeType.toMap().get('whatever')).toBe(undefined)
    })
  })

  describe('of value objects', () => {
    const SomeType = Enum.ofValues({
      Debit: { value: -1, apply: (balance, quantity) => balance.minus(quantity) },
      WHAT: { value: 0, apply: (balance, quantity) => balance },
      Credit: { value: 1, apply: (balance, quantity) => balance.plus(quantity) },
    })
    const missing = {
      Alert: {
        value: 911,
        apply: (balance, quantity) => balance.pow(quantity)
      }
    }

    it('can check for membership by value', () => {
      expect(SomeType.hasValue(SomeType.Debit.value)).toBe(true)
      expect(SomeType.hasValue(missing.value)).toBe(false)
    })

    it('can check for membership by name', () => {
      expect(SomeType.hasName('Debit')).toBe(true)
      expect(SomeType.hasName('whatever')).toBe(false)
    })

    it('can find name of value', () => {
      expect(SomeType.nameOf(SomeType.Debit.value)).toBe('Debit')
      expect(SomeType.nameOf(missing.value)).toBe(undefined)
    })

    it('can access value by name', () => {
      expect(SomeType.valueOf('Debit')).toBe(SomeType.Debit.value)
      expect(SomeType.valueOf('whatever')).toBe(undefined)
    })

    it('can access value directly', () => {
      expect(SomeType.Debit).toBe(SomeType.Debit)
      expect(SomeType.whatever).toBe(undefined)
    })

    it('has inherent ordering', () => {
      expect(SomeType.ordinalOf(SomeType.Debit.value)).toBe(0)
      expect(SomeType.ordinalOf(SomeType.whatever)).toBe(-1)
    })

    it('can be converted to a map', () => {
      expect(SomeType.toMap().get('Debit')).toBe(SomeType.Debit.value)
      expect(SomeType.toMap().get('whatever')).toBe(undefined)
    })
  })
})
