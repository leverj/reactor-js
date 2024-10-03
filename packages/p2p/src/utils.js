import {setTimeout} from 'node:timers/promises'

const ConnectionErrorCodes = ['ECONNREFUSED', 'ECONNRESET']
export async function waitToSync(fns, attempts, timeout, port) {
  if (attempts === 0) throw Error('Sync failed')
  for (let each of fns) {
    const result = await tryFor(each, ConnectionErrorCodes, attempts, timeout, port)
    if (result) continue
    else {
      await setTimeout(timeout)
      return waitToSync(fns, attempts - 1, timeout, port)
    }
  }
}

const ErrorCodes = ['ERR_ENCRYPTION_FAILED', 'ENOENT'].concat(ConnectionErrorCodes)
export const tryAgainIfError = async (fn, attempts, timeout, port) => tryFor(fn, ErrorCodes, attempts, timeout, port)

async function tryFor(fn, errorCode, attempts, timeout, port) {
  if (attempts === 0) throw Error(`Try for failed... ${errorCode}, ${port}`)
  try {
    return await fn()
  } catch (e) {
    if (e.code === errorCode || (Array.isArray(errorCode) && errorCode.includes(e.code))) {
      await setTimeout(timeout)
      return tryFor(fn, errorCode, attempts - 1, timeout, port)
    }
    throw e
  }
}
