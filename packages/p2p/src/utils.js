import {EventEmitter} from 'node:events'
import {setTimeout} from 'node:timers/promises'

export const events = new EventEmitter()
export const NODE_INFO_CHANGED = 'NODE_INFO_CHANGED'
export const PEER_DISCOVERY = 'peer:discovery'
export const PEER_CONNECT = 'peer:connect'

const ConnectionErrorCodes = ['ECONNREFUSED', 'ECONNRESET']
export async function waitToSync(fns, tryCount, timeout, port) {
  if (tryCount === 0) throw Error('Sync failed')
  for (let each of fns) {
    const result = await tryFor(each, ConnectionErrorCodes, tryCount, timeout, port)
    if (result) continue
    else {
      await setTimeout(timeout)
      return waitToSync(fns, tryCount - 1, timeout, port)
    }
  }
}

const ErrorCodes = ['ERR_ENCRYPTION_FAILED', 'ENOENT'].concat(ConnectionErrorCodes)
export const tryAgainIfError = async (fn, tryCount, timeout, port) => tryFor(fn, ErrorCodes, tryCount, timeout, port)

async function tryFor(fn, errorCode, tryCount, timeout, port) {
  if (tryCount === 0) throw Error(`Try for failed... ${errorCode}, ${tryCount}, ${port}`)
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
