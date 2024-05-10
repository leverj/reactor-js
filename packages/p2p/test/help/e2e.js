import config from 'config'
import {mkdir, rm, writeFile} from 'node:fs/promises'
import {fork} from 'child_process'
import {getBridgeInfos} from './fixtures.js'
import path from 'path'
import axios from 'axios'
import {tryAgainIfConnectionError, waitToSync} from '../../src/utils.js'
const __dirname = process.cwd()
console.log('dirname', __dirname)

const childProcesses = []

export const deleteInfoDir = async () => await rm('.e2e', {recursive: true, force: true})
export const killChildProcesses = () => {for (const childProcess of childProcesses) childProcess.kill()}

export async function createApiNodes(count) {
  for (let i = 0; i < count; i++) {
    childProcesses.push(await createApiNode({index: i, isLeader: i === 0}))
  }
  await waitForWhitelistSync(Array(count).fill(0).map((_, i) => 9000 + i))
  return childProcesses
}

export async function createApiNode({index, isLeader = false}) {
  const env = Object.assign({}, process.env, {
    PORT: 9000 + index,
    BRIDGE_CONF_DIR: './.e2e/' + index,
    BRIDGE_PORT: config.bridgeNode.port + index,
    BRIDGE_IS_LEADER: isLeader
  })
  await mkdir(env.BRIDGE_CONF_DIR, {recursive: true})
  return fork(`app.js`, [], {cwd: __dirname, env})
}

export async function createInfo_json(count) {
  const bridgeInfos = getBridgeInfos(count)
  for (let i = 0; i < count; i++) {
    const info = bridgeInfos[i]
    let dir = path.join(__dirname, '.e2e', i.toString())
    await mkdir(dir, {recursive: true})
    await writeFile(path.join(dir, 'info.json'), JSON.stringify(info, null, 2))
  }
}

export async function waitForWhitelistSync(ports) {
  const fn = (port) => async () => {
    const {data: whitelists} = await axios.get(`http://127.0.0.1:${port}/api/peer/whitelist`)
    return whitelists.length === ports.length
  }
  await waitToSync(ports.map(fn))
  console.log('whitelist synced...')
}

export async function connect(ports) {
  for (const port of ports) {
    await tryAgainIfConnectionError(_ => axios.post(`http://127.0.0.1:${port}/api/peer/connect`))
  }
  const fn = (port) => async () => {
    const {data: peers} = await axios.get(`http://127.0.0.1:${port}/api/peer`)
    return peers.length === ports.length - 1
  }
  await waitToSync(ports.map(fn))
  console.log('connected...')
}

