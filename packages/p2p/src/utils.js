import {EventEmitter} from 'node:events'
import config from 'config'
import {setTimeout} from 'node:timers/promises'

export const events = new EventEmitter()
export const INFO_CHANGED = 'INFO_CHANGED'
export const PEER_DISCOVERY = 'peer:discovery'
export const PEER_CONNECT = 'peer:connect'

export async function waitToSync(fns, tryCount, timeout) {
  if (tryCount === 0) throw Error('Sync failed')
  for (let each of fns) {
    const result = await tryAgainIfConnectionError(each, tryCount, timeout)
    if (result) continue
    else {
      await setTimeout(timeout)
      return waitToSync(fns, tryCount - 1, timeout)
    }
  }
}

export const tryAgainIfError = async (fn, tryCount, timeout) => await tryFor(fn, ['ECONNREFUSED', 'ECONNRESET', 'ERR_ENCRYPTION_FAILED', 'ENOENT'], tryCount, timeout)
const tryAgainIfConnectionError = async (fn, tryCount, timeout) => await tryFor(fn, ['ECONNREFUSED', 'ECONNRESET'], tryCount, timeout)
async function tryFor(fn, errorCode, tryCount, timeout) {
  if (tryCount === 0) throw Error(`Try for failed... ${errorCode}, ${tryCount}, ${config.port}`)
  try {
    return await fn()
  } catch (e) {
    if (e.code === errorCode || (Array.isArray(errorCode) && errorCode.includes(e.code))) {
      await setTimeout(timeout)
      return tryFor(fn, errorCode, tryCount - 1, timeout)
    }
    throw e
  }
}
