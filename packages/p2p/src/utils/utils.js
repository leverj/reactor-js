import {setTimeout} from 'timers/promises'
import config from 'config'
import {logger} from '@leverj/common/utils'

const timeout_ = config.timeout
const tryCount_ = config.tryCount

export async function tryFor(fn, errorCode, tryCount = tryCount_) {
  if (tryCount === 0) throw new Error(`Try for failed... ${errorCode}, ${tryCount_}, ${config.port}`)
  try {
    return await fn()
  } catch (e) {
    if (e.code === errorCode || (Array.isArray(errorCode) && errorCode.includes(e.code))) {
      // logger.log('Retrying...', e.message, e.code)
      await setTimeout(timeout_)
      return tryFor(fn, errorCode, tryCount - 1)
    }
    throw e
  }
}

export const tryAgainIfError = async (fn, tryCount) => await tryFor(fn, ['ECONNREFUSED', 'ECONNRESET', 'ERR_ENCRYPTION_FAILED', 'ENOENT'], tryCount)
export const tryAgainIfConnectionError = async (fn, tryCount) => await tryFor(fn, ['ECONNREFUSED', 'ECONNRESET'], tryCount)
export const tryAgainIfEncryptionFailed = async (fn, tryCount) => await tryFor(fn, 'ERR_ENCRYPTION_FAILED', tryCount)


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

export const shortHash = (hash) => hash.slice(0, 4) + '..' + hash.slice(-3)
