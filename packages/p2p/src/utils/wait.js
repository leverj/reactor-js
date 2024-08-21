import config from 'config'
import {setTimeout} from 'node:timers/promises'
import {tryAgainIfConnectionError} from './try.js'

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
