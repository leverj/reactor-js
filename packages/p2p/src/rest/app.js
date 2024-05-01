import bodyParser from 'body-parser'
import express from 'express'
import router from './router.js'
import config from 'config'

const peerIdJson = fs.readFileSync(path.join(config.nodeDirectory, ''), 'utf8')
const bridge = new Bridge({port})
const app = express()
app.use(bodyParser.json())
app.use(express.json())
app.use('/api', router)
// app.use(handleError)

export default app
