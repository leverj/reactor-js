import {setTimeout} from 'timers/promises'

const timeout_ = 100
const tryCount_ = 50

export async function tryFor(fn, errorCode, tryCount = tryCount_) {
  if (tryCount === 0) throw new Error(`Try for failed... ${errorCode}`)
  try {
    return await fn()
  } catch (e) {
    if (e.code === errorCode || (Array.isArray(errorCode) && errorCode.includes(e.code))) {
      console.log('Retrying...', e.message, e.code)
      await setTimeout(timeout_)
      return tryFor(fn, errorCode, tryCount - 1)
    }
    throw e
  }
}

export const tryAgainIfConnectionError = async (fn, tryCount = tryCount_) => await tryFor(fn, ['ECONNREFUSED', 'ECONNRESET'], tryCount)
export const tryAgainIfEncryptionFailed = async (fn, tryCount = tryCount_) => await tryFor(fn, 'ERR_ENCRYPTION_FAILED', tryCount)


export async function waitToSync(fns, tryCount = tryCount_) {
  if (tryCount === 0) throw new Error('Sync failed')
  for (const fn of fns) {
    const result = await tryAgainIfConnectionError(fn)
    if (result) continue
    else {
      await setTimeout(timeout_)
      return waitToSync(fns, tryCount - 1)
    }
  }
}
