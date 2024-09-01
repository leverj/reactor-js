import {expect} from 'expect'
import {MicrosecondsTimestampGenerator, UuidGenerator} from '@leverj/common/utils'


describe('generators', () => {
  it('MicrosecondsTimestampGenerator', () => {
    const generator = new MicrosecondsTimestampGenerator(0)
    expect(generator.next()).not.toEqual(generator.next())
    expect(new MicrosecondsTimestampGenerator(0).next()).not.toEqual(new MicrosecondsTimestampGenerator(1).next())
  })

  it('UuidGenerator', () => {
    const generator = UuidGenerator
    expect(generator.next()).not.toEqual(generator.next())
    expect(generator.nextAsNumberString()).not.toEqual(generator.nextAsNumberString())
    expect(/^\d+$/.test(generator.nextAsNumberString())).toBe(true)
  })
})
