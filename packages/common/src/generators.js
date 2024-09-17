import {toBigInt} from 'ethers'
import {v1} from 'uuid'
import {toMicroseconds} from './time.js'

export const UuidGenerator = {
  next: () => v1(),
  nextAsNumberString: () => toBigInt('0x' + v1().replaceAll('-', '')).toString(),
}

export class MicrosecondsTimestampGenerator {
  constructor(micros = 0) { this.micros = micros }
  next() { return toMicroseconds(Date.now())  + (++this.micros % 1000) }
}
