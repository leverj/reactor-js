import {ApiApp} from './src/apiApp.js'
const api = new ApiApp()
api.start()
api.connectToBridge()
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received')
  api.stop()
  process.exit()
})
