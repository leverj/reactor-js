export const mask = (e) => {
  console.error(e)
  return Error('unable to complete operation')
}

export const rethrowMasked = (e) => { throw mask(e) }

export const rethrow = (e) => { throw e }

export const CausedError = (message, e) => Error(message, {cause: e})
export const CodedError = (message, code) => Object.assign(Error(message), {code})

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
