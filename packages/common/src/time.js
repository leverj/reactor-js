const modulo = (dividend, divisor) => dividend - (dividend % divisor)

export const milliseconds = 1, millisecond = milliseconds, milli = milliseconds, ms = milliseconds
export const seconds = 1000, second = seconds, sec = seconds
export const minutes = 60 * seconds, minute = minutes, min = minutes
export const hours = 60 * minutes, hour = hours, hr = hours
export const days = 24 * hours, day = days
export const weeks = 7 * days, week = weeks

export const before = (timestamp, n, duration = milliseconds) => timestamp - n * duration
export const after = (timestamp, n, duration = milliseconds) => timestamp + n * duration

export const fromMicroseconds = (milliseconds) => parseInt(milliseconds / 1000)
export const toMicroseconds = (milliseconds) => milliseconds * 1000

export const fromSeconds = (seconds) => seconds * 1000
export const toSeconds = (milliseconds) => parseInt(milliseconds / 1000)

export const toNearestStartOfDuration = (timestamp, duration) => modulo(timestamp, duration)
export const toNearestEndOfDuration = (timestamp, duration) => toNearestStartOfDuration(timestamp, duration) + duration
export const toStartOfDay = (timestamp) => toNearestStartOfDuration(timestamp, day)

export const toUTC = (date) => new Date(date - date.getTimezoneOffset() * 60000)
