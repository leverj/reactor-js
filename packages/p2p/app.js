import {ApiApp} from './src/apiApp.js'

const api = new ApiApp()
api.start()
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received')
  api.stop()
  process.exit()
})

// fixme: only for testing purpose... need to remove before production
if (process.env.FAIL) {
  const minute = 60000
  let timeout = Math.round(minute + Math.random() * minute)
  setTimeout(() => {
    console.log(`Exiting after ${timeout / 1000} seconds`)
    api.stop()
    process.exit(1)
  }, timeout)
}