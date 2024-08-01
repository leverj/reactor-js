import {logger} from '@leverj/common/utils'
import {ApiApp} from './src/apiApp.js'

const api = new ApiApp()
api.start()
process.on('SIGTERM', () => {
  logger.log('SIGTERM signal received')
  api.stop()
  process.exit()
})

// note: used when stress testing ...
if (process.env.FAIL) {
  const minute = 60000
  const timeout = Math.round(minute + Math.random() * minute)
  setTimeout(() => {
    logger.log(`Exiting after ${timeout / 1000} seconds`)
    api.stop()
    process.exit(1)
  }, timeout)
}
