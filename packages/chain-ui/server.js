import {createRequestHandler} from '@remix-run/express'
import express from 'express'

const viteDevServer = process.env.NODE_ENV === 'production' ?
  null :
  await import('vite').then(_ => _.createServer({server: {middlewareMode: true}}))

const app = express()
app.use(viteDevServer ? viteDevServer.middlewares : express.static('build/client'))
app.all('*', createRequestHandler({build: viteDevServer ?
    () => viteDevServer.ssrLoadModule('virtual:remix/server-build') :
    await import('./build/server/index.js')}))
app.listen(3000, () => console.log('App listening on http://localhost:3000'))
