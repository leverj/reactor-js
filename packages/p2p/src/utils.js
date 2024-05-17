import {setTimeout} from 'timers/promises'
import config from 'config'

const timeout_ = config.timeout
const tryCount_ = config.tryCount

export async function tryFor(fn, errorCode, tryCount = tryCount_) {
  if (tryCount === 0) throw new Error(`Try for failed... ${errorCode}, ${tryCount_}, ${config.port}`)
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

export const tryAgainIfConnectionError = (fn) => tryFor(fn, ['ECONNREFUSED', 'ECONNRESET'])
export const tryAgainIfEncryptionFailed = (fn) => tryFor(fn, 'ERR_ENCRYPTION_FAILED')


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
