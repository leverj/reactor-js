import {ApiApp} from './src/ApiApp.js'
const api = new ApiApp()
api.start()
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received')
  api.stop()
  process.exit()
})
