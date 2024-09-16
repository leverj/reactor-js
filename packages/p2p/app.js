import {logger} from '@leverj/common'
import {ApiApp} from './src/ApiApp.js'
import config from './config.js'

const api = await ApiApp.new(config)
api.start()
process.on('SIGTERM', () => {
  logger.log('SIGTERM signal received')
  api.stop()
  process.exit()
})

// note: enable in case you start getting unhandled rejections
// process.on('unhandledRejection', (reason, promise) => {
//   logger.error('Unhandled Rejection caught at:', promise, 'reason:', reason)
// })

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
