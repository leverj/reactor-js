import {logger} from '@leverj/common/utils'
import axios from 'axios'
import {fork} from 'child_process'
import config from 'config'
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs'
import {setTimeout} from 'node:timers/promises'
import {tryAgainIfError, waitToSync} from '../../src/utils/index.js'
import {getNodeInfos} from './fixtures.js'

const {bridgeNode, externalIp} = config
const tryCount = 10
export const e2ePath = `${process.cwd()}/../../data/.e2e`

const dirPath = (i) => `${e2ePath}/${i}`
const filePath = (i) => `${dirPath(i)}/info.json`
export const getInfo = (port) => JSON.parse(readFileSync(filePath(port - 9000)).toString())
// export const getInfo = (port) => store.get(port - 9000)

export const GET = (port, endpoint) => axios.get(`http://127.0.0.1:${port}/api/${endpoint}`).then(_ => _.data)
export const POST = (port, endpoint, payload) => axios.post(`http://127.0.0.1:${port}/api/${endpoint}`, payload || {})

const processes = {}

export async function stop(ports = Array.from(Object.keys(processes))) {
  for (let each of ports) {
    await processes[each].kill()
    delete processes[each]
  }
  await setTimeout(100)
}

export async function createApiNodesFrom(ports, howMany) {
  async function createApiNode(port) {
    const index = port - 9000
    const bootstrapNodes = port === 9000 ?
      [] :
      await tryAgainIfError(_ => getInfo(9000).p2p.id).then(_ => [`/ip4/${externalIp}/tcp/10000/p2p/${_}`], tryCount)
    const env = Object.assign({}, process.env, {
      PORT: port,
      BRIDGE_CONF_DIR: `${e2ePath}/${index}`, //fixme: we want to use JSONStore instead
      BRIDGE_PORT: bridgeNode.port + index,
      BRIDGE_BOOTSTRAP_NODES: JSON.stringify(bootstrapNodes),
    })
    mkdirSync(env.BRIDGE_CONF_DIR, {recursive: true})
    return fork('app.js', [], {cwd: process.cwd(), env})
  }

  for (let each of ports) {
    processes[each] = await createApiNode(each)
    await setTimeout(100)
  }
  await waitForBootstrapSync(ports, howMany)
  return ports
}

export const publishWhitelist = async (ports, total, available) =>
  tryAgainIfError(_ => POST(9000, 'whitelist/publish')).then(_ => waitForWhitelistSync(ports, total, available), tryCount)

export async function createApiNodes(howMany, whitelist = true) {
  const ports = new Array(howMany).fill(0).map((_, i) => 9000 + i)
  await createApiNodesFrom(ports)
  if (whitelist) await publishWhitelist(ports)
  return ports
}

export async function createNodeInfos(howMany) {
  for (let [i, info] of Object.entries(getNodeInfos(howMany))) {
    mkdirSync(dirPath(i), {recursive: true})
    writeFileSync(filePath(i), JSON.stringify(info, null, 2))
  }
}

async function waitForBootstrapSync(ports, howMany = ports.length - 1) {
  const fn = _ => async () => GET(_, 'peer').then(_ => _.length === howMany)
  await waitToSync(ports.map(fn))
  logger.log('bootstrap synced...')
}

export async function waitForWhitelistSync(ports, total = ports.length) {
  const fn = _ => async () => GET(_, 'whitelist').then(_ => _.length === total)
  await waitToSync(ports.map(fn))
  logger.log('whitelisted synced...')
}
