import {ApiApp} from './src/apiApp.js'
const api = new ApiApp()
api.start()
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received')
  api.stop()
  process.exit()
})

// fixme: only for testing purpose... need to remove before production
const minute = 60000
if(process.env.FAIL)
  setTimeout(() => {
    console.log('Exiting after 10 seconds')
    api.stop()
    process.exit(1)
  }, Math.round(2* minute + Math.random() * minute))