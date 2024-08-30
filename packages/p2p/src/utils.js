import {EventEmitter} from 'node:events'
import config from 'config'
import {setTimeout} from 'node:timers/promises'

export const events = new EventEmitter()
export const INFO_CHANGED = 'INFO_CHANGED'
export const PEER_DISCOVERY = 'peer:discovery'
export const PEER_CONNECT = 'peer:connect'


async function tryFor(fn, errorCode, tryCount = config.tryCount) {
  if (tryCount === 0) throw Error(`Try for failed... ${errorCode}, ${tryCount}, ${config.port}`)
  try {
    return await fn()
  } catch (e) {
    if (e.code === errorCode || (Array.isArray(errorCode) && errorCode.includes(e.code))) {
      await setTimeout(config.timeout)
      return tryFor(fn, errorCode, tryCount - 1)
    }
    throw e
  }
}
export const tryAgainIfError = async (fn, tryCount) => await tryFor(fn, ['ECONNREFUSED', 'ECONNRESET', 'ERR_ENCRYPTION_FAILED', 'ENOENT'], tryCount)
export const tryAgainIfConnectionError = async (fn, tryCount) => await tryFor(fn, ['ECONNREFUSED', 'ECONNRESET'], tryCount)

export async function waitToSync(fns, tryCount = config.tryCount) {
  if (tryCount === 0) throw Error('Sync failed')
  for (let each of fns) {
    const result = await tryAgainIfConnectionError(each)
    if (result) continue
    else {
      await setTimeout(config.timeout)
      return waitToSync(fns, tryCount - 1)
    }
  }
}
