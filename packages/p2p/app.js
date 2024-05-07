import {ApiApp} from './src/apiApp.js'
const api = new ApiApp()
api.start()
await api.connectToLeader()
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received')
  api.stop()
  process.exit()
})
