import config from 'config'
import {mkdir, readFile, rm, writeFile} from 'node:fs/promises'
import {fork} from 'child_process'
import {getBridgeInfos} from './fixtures.js'
import path from 'path'
import axios from 'axios'
import {tryAgainIfConnectionError, tryAgainIfError, waitToSync} from '../../src/utils/utils.js'
import {setTimeout} from 'node:timers/promises'

const __dirname = process.cwd()

const childProcesses = {}

const filePath = (i) => path.join(__dirname, '.e2e', i.toString(), 'info.json')
const dirPath = (i) => path.join(__dirname, '.e2e', i.toString())

export const deleteInfoDir = async () => await rm('.e2e', {recursive: true, force: true})
export const killChildProcesses = async () => {
  await stop(...Object.keys(childProcesses))
}
export const stop = async (...ports) => {
  for (const port of ports) {
    await childProcesses[port].kill()
    delete childProcesses[port]
  }
  await setTimeout(200)
}

async function getBootstrapNodes() {
  let peerId = await tryAgainIfError(_ => getPeerId(0))
  return [`/ip4/${config.externalIp}/tcp/10000/p2p/${peerId}`]
}

export async function publishWhitelist(ports, total, available) {
  await tryAgainIfError(_ => axios.post(`http://127.0.0.1:${ports[0]}/api/publish/whitelist`))
  await waitForWhitelistSync(ports, total, available)
}

export async function createFrom(ports, count) {
  for (const port of ports) {
    const index = port - 9000
    const bootstrapNodes = index === 0 ? [] : await getBootstrapNodes()
    childProcesses[port] = await createApiNode({index, isLeader: index === 0, bootstrapNodes: JSON.stringify(bootstrapNodes)})
    await setTimeout(200)
  }
  await waitForBootstrapSync(ports, count)
  return ports
}

export async function createApiNodes(count, whitelist = true) {
  const ports = new Array(count).fill(0).map((_, i) => 9000 + i)
  await createFrom(ports)
  if (whitelist) await publishWhitelist(ports)
  return ports
}

export async function createApiNode({index, isLeader = false, bootstrapNodes}) {
  const env = Object.assign({}, process.env, {
    PORT: 9000 + index,
    BRIDGE_CONF_DIR: './.e2e/' + index,
    BRIDGE_PORT: config.bridgeNode.port + index,
    BRIDGE_IS_LEADER: isLeader,
    BRIDGE_BOOTSTRAP_NODES: bootstrapNodes,
    CONTRACT_TESTING: false,
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
    await mkdir(dirPath(i), {recursive: true})
    await writeFile(filePath(i), JSON.stringify(info, null, 2))
  }
}

async function getPeerId(i) {
  const file = await readFile(filePath(i))
  return JSON.parse(file.toString()).p2p.id
}

export async function getWhitelists(port) {
  const file = await readFile(filePath(port - 9000))
  return JSON.parse(file.toString()).whitelist
}

export async function getMonitorStatus(port) {
  const {data: peers} = await axios.get(`http://127.0.0.1:${port}/api/peer/status`)
  return peers
}


async function waitForBootstrapSync(ports, count = ports.length - 1) {
  const fn = (port) => async () => {
    const {data: peers} = await axios.get(`http://127.0.0.1:${port}/api/peer`)
    return peers.length === count
  }
  await waitToSync(ports.map(fn))
  console.log('bootstrap synced...')
}


export async function waitForWhitelistSync(ports, total = ports.length, available = ports.length) {
  console.log('#'.repeat(50), 'waitForWhitelistSync', ports, total)
  const fn = (port) => async () => {
    const whitelists = await getMonitorStatus(port)
    return whitelists.length === total - 1 && whitelists.filter(_ => _.latency !== -1).length === available - 1
  }
  await waitToSync(ports.map(fn))
  console.log('whitelisted synced...')
}

export const startDkg = async () => await axios.post(`http://127.0.0.1:9000/api/dkg/start`)
export const getPublicKey = async (port) => {
  const file = await readFile(filePath(port - 9000))
  return JSON.parse(file.toString()).tssNode.groupPublicKey
}
export const getInfo = async (port) => {
  const file = await readFile(filePath(port - 9000))
  return JSON.parse(file.toString())
}