export const mask = (e) => {
  console.error(e)
  return Error('unable to complete operation')
}

export const rethrowMasked = (e) => { throw mask(e) }

export const rethrow = (e) => { throw e }
