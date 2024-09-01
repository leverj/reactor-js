export const Failure = function SpecifiedError(message, code) {
  this.name = this.constructor.name
  this.message = message || ''
  this.code = code || ''
  this.stack = Error().stack
}
Failure.prototype = Error()
Failure.prototype.constructor = Failure

export class InvalidArgument extends Failure {
  constructor(key, value, reason = '') {
    super(`InvalidArgument: ${key}=${value} ${reason}`)
    this.key = key
    this.value = value
  }
}
