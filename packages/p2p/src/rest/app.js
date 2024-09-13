import bodyParser from 'body-parser'
import express from 'express'
import {createRouter} from './router.js'

export function createApp(config, node) {
  const app = express()
  app.use(bodyParser.json())
  app.use(express.json())
  app.use('/api', createRouter(config, node))
  return app
}
