import bodyParser from 'body-parser'
import express from 'express'
import router from './router.js'

const app = express()
app.use(bodyParser.json())
app.use(express.json())
app.use('/api', router)
// app.use(handleError)

export default app
