import convict from 'convict'
// import {expand} from '@dotenvx/dotenvx'
//    "@dotenvx/dotenvx": "^1.13.2",
import {get, set} from 'lodash-es'
import {existsSync} from 'node:fs'
import 'dotenv/config'

const configDir = `${process.env.PWD}/config`

export async function configure(schema, postLoad = _ => _, options = {}) {
  const config = convict(schema, options)
  const env = config.get('env')
  // await override('defaults.js', config)
  await override(`${env}.js`, config)
  await override(`local-${env}.js`, config)
  for (const each of schema.dependencies || []) inferDependency(config._instance, each)
  inferDeferredValues(config._instance)
  config.validate({allowed: 'strict'})
  return postLoad(config.getProperties())
}

async function override(fileName, config) {
  const path = `${configDir}/${fileName}`
  if (!existsSync(path)) return
  const {default: override} = await import(path)
  config.load(override || {})
}

function inferDependency(obj, path) {
  const value = get(obj, path)
  if (typeof value === 'function') set(obj, path, value.apply(obj))
}

function inferDeferredValues(obj, context = obj) {
  for (let [key, value] of Object.entries(obj)) {
    if (value && typeof value === 'object') inferDeferredValues(value, context)
    else if (typeof value === 'function') obj[key] = value.apply(context)
  }
}
