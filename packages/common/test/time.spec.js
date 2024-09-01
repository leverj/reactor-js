import {expect} from 'expect'
import {
  after,
  before,
  day,
  days,
  fromMicroseconds,
  hours,
  toMicroseconds,
  toNearestEndOfDuration,
  toNearestStartOfDuration,
  week,
} from '@leverj/common/utils'


const today = Date.UTC(2021, 6, 1)
const tomorrow = today + 1 * day
const nextWeek = today + 7 * days
const yesterday = today - 1 * day
const lastWeek = today - 7 * days

describe('time', () => {
  it('before & after', () => {
    expect(before(today, 1, day)).toEqual(yesterday)
    expect(after(today, 1, day)).toEqual(tomorrow)

    expect(before(today, 7, days)).toEqual(lastWeek)
    expect(after(today, 7, days)).toEqual(nextWeek)

    expect(before(today, 1, week)).toEqual(lastWeek)
    expect(after(today, 1, week)).toEqual(nextWeek)
  })

  it('from/to microseconds', () => {
    expect(toMicroseconds(0)).toEqual(0)
    expect(toMicroseconds(1)).toEqual(1000)
    expect(toMicroseconds(today)).toEqual(today * 1000)
    expect(fromMicroseconds(toMicroseconds(today))).toEqual(today)
    expect(fromMicroseconds(1000)).toEqual(1)
    expect(fromMicroseconds(0)).toEqual(0)
  })

  it('to nearest start/end of duration', () => {
    const _2_hours_ago = before(today, 2, hours)
    expect(toNearestStartOfDuration(_2_hours_ago, day)).toEqual(yesterday)
    expect(toNearestEndOfDuration(_2_hours_ago, day)).toEqual(today)

    const _2_hours_ahead = after(today, 2, hours)
    expect(toNearestStartOfDuration(_2_hours_ahead, day)).toEqual(today)
    expect(toNearestEndOfDuration(_2_hours_ahead, day)).toEqual(tomorrow)
  })
})
