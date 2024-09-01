/*** Tiny replacement for assert suitable for use in browsers. Supports return status codes ***/
export function affirm(condition, message, statusCode, silent) {
  if (!condition) {
    const error = Error(message || 'Assertion failed')
    if (statusCode) error.statusCode = statusCode
    if (silent) error.silent = silent
    throw error
  }
}

export function affirmExists(object, statusCode) {
  const keys = Object.keys(object)
  for (const key of keys) {
    affirm(object[key] !== undefined && object[key] !== null, `${key} missing`, statusCode)
  }
}
