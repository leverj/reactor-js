import config from 'config'
import {mkdir, rm, writeFile} from 'node:fs/promises'
import {fork} from 'child_process'
import {getBridgeInfos} from './fixtures.js'
import path from 'path'
import axios from 'axios'
import {tryAgainIfConnectionError, waitToSync} from '../../src/utils.js'
import {setTimeout} from 'node:timers/promises'

const __dirname = process.cwd()
console.log('dirname', __dirname)

const childProcesses = []

export const deleteInfoDir = async () => await rm('.e2e', {recursive: true, force: true})
export const killChildProcesses = async () => {for (const childProcess of childProcesses) await childProcess.kill()}

export async function createApiNodes(count) {
  const ports = []
  for (let i = 0; i < count; i++) {
    childProcesses.push(await createApiNode({index: i, isLeader: i === 0}))
    ports.push(9000 + i)
    await setTimeout(200)
  }
  await waitForLeaderSync(ports)
  await axios.post(`http://127.0.0.1:${ports[0]}/api/publish/whitelist`)
  await waitForWhitelistSync(ports)
  return ports
}

export async function createApiNode({index, isLeader = false}) {
  const env = Object.assign({}, process.env, {
    PORT: 9000 + index,
    BRIDGE_CONF_DIR: './.e2e/' + index,
    BRIDGE_PORT: config.bridgeNode.port + index,
    BRIDGE_IS_LEADER: isLeader,
    // TRY_COUNT: -1,
    // TIMEOUT: 1000
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

export async function waitForLeaderSync(ports) {
  for (const port of ports) {
    try {
    const {data: {leader}} = await axios.get(`http://127.0.0.1:${port}/api/peer/leader`)
      if (!leader) throw new Error(`leader not synced... port: ${port}`)
      await setTimeout(200)
    } catch (e) {
      console.log(port, e)
      throw e
  }

  }
  console.log('leader synced...')
}

export async function waitForWhitelistSync(ports) {
  const fn = (port) => async () => {
    const {data: whitelists} = await axios.get(`http://192.168.1.69:${port}/api/peer/whitelist`)
    return whitelists.length === ports.length
  }
  await waitToSync(ports.map(fn))
  console.log('whitelist synced...')
}

export async function connect() {
  await tryAgainIfConnectionError(_ => axios.post(`http://127.0.0.1:9000/api/peer/connect`))
  console.log('connected...')
}

