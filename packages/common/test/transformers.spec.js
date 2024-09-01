import {expect} from 'expect'
import randomhex from 'randomhex'
import {Compose, Dictionary, Enum, Enumerate, Functional, Keys, Type} from '@leverj/common/utils'


describe('Transformer', () => {
  describe('Dictionary', () => {
    const registry = {
      空: { address: 'here', tokenSymbol: 'WHAT' },
      EVER: { address: 'there', tokenSymbol: 'EVER' },
    }
    registry.tokens = [registry.空, registry.EVER]
    const transformer = Dictionary(...(registry.tokens.map(_ => [_.address, _.tokenSymbol])))
    const missing = { address: randomhex(20), tokenSymbol: 'Unknown' }

    it('can map & map-back', () => {
      expect(transformer.map(registry.EVER.address)).toBe('EVER')
      expect(transformer.map(missing)).toBe(missing)

      expect(transformer.mapBack('EVER')).toBe(registry.EVER.address)
      expect(transformer.mapBack('whatever')).toBe('whatever')

      expect(transformer.mapBack(transformer.map(registry.EVER.address))).toBe(registry.EVER.address)
      expect(transformer.mapBack(transformer.map(missing))).toBe(missing)
    })
  })

  describe('Functional', () => {
    it('can map & map-back', () => {
      const Int_to_BinaryString = (v) => v.toString(2)
      const BinaryString_to_Int = (v) => parseInt(v, 2)
      const transformer = Functional(Int_to_BinaryString, BinaryString_to_Int)

      expect(transformer.map(1)).toBe('1')
      expect(transformer.map(10)).toBe('1010')

      expect(transformer.mapBack('1')).toBe(1)
      expect(transformer.mapBack('1010')).toBe(10)

      expect(transformer.mapBack(transformer.map(1))).toBe(1)
      expect(transformer.mapBack(transformer.map(10))).toBe(10)
    })
  })

  describe('Enumerate', () => {
    it('can map & map-back for numbers', () => {
      const SomeType = Enum.of({zero: 0, one: 1})
      const transformer = Enumerate(SomeType)
      const missing = 10

      expect(transformer.map(1)).toBe('one')
      expect(transformer.map(missing)).toBe(missing)

      expect(transformer.mapBack('one')).toBe(1)
      expect(transformer.mapBack('whatever')).toBe('whatever')

      expect(transformer.mapBack(transformer.map(1))).toBe(1)
      expect(transformer.mapBack(transformer.map(missing))).toBe(missing)
    })

    it('can map & map-back for strings', () => {
      const SomeType = Enum.of({zero: '٠', one: '١'})
      const transformer = Enumerate(SomeType)
      const missing = '١٠'

      expect(transformer.map('١')).toBe('one')
      expect(transformer.map(missing)).toBe(missing)

      expect(transformer.mapBack('one')).toBe('١')
      expect(transformer.mapBack('whatever')).toBe('whatever')

      expect(transformer.mapBack(transformer.map('١'))).toBe('١')
      expect(transformer.mapBack(transformer.map(missing))).toBe(missing)
    })

    it('can map & map-back for objects', () => {
      const registry = {
        空: { address: 'here', tokenSymbol: 'WHAT' },
        EVER: { address: 'there', tokenSymbol: 'EVER' },
      }
      const SomeType = Enum.of({zero: registry.空, one: registry.EVER})
      const transformer = Enumerate(SomeType)
      const missing = { address: randomhex(20), tokenSymbol: 'Unknown' }

      expect(transformer.map(registry.EVER)).toBe('one')
      expect(transformer.map(missing)).toBe(missing)

      expect(transformer.mapBack('one')).toBe(registry.EVER)
      expect(transformer.mapBack('whatever')).toBe('whatever')

      expect(transformer.mapBack(transformer.map(registry.EVER))).toBe(registry.EVER)
      expect(transformer.mapBack(transformer.map(missing))).toBe(missing)
    })
  })

  describe('Compose', () => {
    const number2english = Dictionary([1, 'one'], [2, 'two'], [3, 'three'])
    const english2spanish = Dictionary(['one', 'uno'], ['two', 'dos'], ['three', 'tres'])
    const spanish2chinese = Dictionary(['uno', 'Yī'], ['dos', '二'], ['tres', '三'])
    const chinese2russian = Dictionary(['Yī', 'один'], ['二', 'два'], ['三', 'три'])
    const russian2hebrew = Dictionary(['один', 'אחד'], ['два', 'שתיים'], ['три', 'שלוש'])
    const transformer = Compose(number2english, english2spanish, spanish2chinese, chinese2russian, russian2hebrew)
    const missing = 10

    it('can map & map-back', () => {
      expect(transformer.map(1)).toBe('אחד')
      expect(transformer.map('one')).toBe('אחד')
      expect(transformer.map('uno')).toBe('אחד')
      expect(transformer.map('Yī')).toBe('אחד')
      expect(transformer.map('один')).toBe('אחד')
      expect(transformer.map(missing)).toBe(missing)

      expect(transformer.mapBack('אחד')).toBe(1)
      expect(transformer.mapBack('один')).toBe(1)
      expect(transformer.mapBack('Yī')).toBe(1)
      expect(transformer.mapBack('uno')).toBe(1)
      expect(transformer.mapBack('one')).toBe(1)
      expect(transformer.mapBack('whatever')).toBe('whatever')

      expect(transformer.mapBack(transformer.map(1))).toBe(1)
      expect(transformer.mapBack(transformer.map('one'))).toBe(1)
      expect(transformer.mapBack(transformer.map('uno'))).toBe(1)
      expect(transformer.mapBack(transformer.map('Yī'))).toBe(1)
      expect(transformer.mapBack(transformer.map('один'))).toBe(1)
      expect(transformer.mapBack(transformer.map('אחד'))).toBe(1)
      expect(transformer.mapBack(transformer.map(missing))).toBe(missing)
    })
  })

  describe('Keys', () => {
    const transformer = Keys(Dictionary(
      ['array', 'a'],
      ['number', 'n'],
      ['map', 'm'],
      ['string', 's'],
      ['abc', 'ABC'],
      ['deep', 'd'],
      ['deepest', 'ddd'],
      ['term', 'T'],
    ))

    it('can map (but not map-back)', () => {
      const subject = {
        number: 1,
        string: '1 2 3',
        array: [
          1,
          { abc: 2 },
          { displayString: 'four five' },
          { term: 1 },
        ],
        map: new Map([
          ['one', { number: 111 }],
          ['two', {
            deep: {
              abc: 0,
              prettyString: 'what ever',
              deepest: {term: 0}
            }
          }],
        ])
      }

      expect(transformer.map(subject)).toMatchObject({
          n: 1,
          s: '1 2 3',
          a: [
            1,
            { ABC: 2 },
            { displayString: 'four five' },
            { T: 1 },
          ],
          m: new Map([
            ['one', { n: 111 }],
            ['two', {
              d: {
                ABC: 0,
                prettyString: 'what ever',
                ddd: {T: 0}
              }
            }],
          ])
        }
      )

      expect(() => transformer.mapBack(transformer.map(subject))).toThrow(/disabled/)
    })
  })

  describe('Type & Values', () => {
    it('can map (but not map-back)', () => {
      const NumberType = Enum.of({unknown: 0, negative: 1, positive: 2})
      const TermType = Enum.of({unknown: 0, verb: 1, noun: 2})
      const from = Type('Number', ['number'], Enumerate(NumberType)).
      add('Number', ['term'], Enumerate(TermType)).
      add('String', ['string'], Functional(v => v.replace(/ /g, '-')))
      const to = Type('String', ['number'], Functional(v => NumberType.valueOf(v))).
      add('String', ['term'], Functional(v => TermType.valueOf(v))).
      add('String', ['string'], Functional(v => v.replace(/-/g, ' ')))

      const pojo = {
        number: 1,
        string: '1 2 3',
        array: [
          1,
          { number: 2 },
          { string: 'four five' },
          { term: 1 },
        ],
        map: new Map([
          ['one', { number: 111 }],
          ['two', {
            deep: {
              number: 0,
              string: 'what ever',
              deepest: {term: 0}
            }
          }],
        ])
      }

      expect(from.map(pojo)).toMatchObject({
        number: 'negative',
        string: '1-2-3',
        array: [
          1,
          { number: 'positive' },
          { string: 'four-five' },
          { term: 'verb' },
        ],
        map: new Map([
          ['one', { number: 111 }],
          ['two', {
            deep: {
              number: 'unknown',
              string: 'what-ever',
              deepest: {term: 'unknown'}
            }
          }],
        ])
      })

      expect(() => from.mapBack(from.map(pojo))).toThrow(/disabled/)
    })
  })
})


