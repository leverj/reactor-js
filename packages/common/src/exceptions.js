export const mask = (e, as = 'unable to complete operation') => Error(as)
export const rethrowMasked = (e) => { throw mask(e) }
export const rethrow = (e) => { throw e }
