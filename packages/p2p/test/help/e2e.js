import config from 'config'
import {mkdir, readFile, rm, writeFile} from 'node:fs/promises'
import {fork} from 'child_process'
import {getBridgeInfos} from './fixtures.js'
import path from 'path'
import axios from 'axios'
import {tryAgainIfError, waitToSync} from '../../src/utils.js'
import {setTimeout} from 'node:timers/promises'

const __dirname = process.cwd()
console.log('dirname', __dirname)

const childProcesses = []

const filePath = (i) => path.join(__dirname, '.e2e', i.toString(), 'info.json')
const dirPath = (i) => path.join(__dirname, '.e2e', i.toString())

export const deleteInfoDir = async () => await rm('.e2e', {recursive: true, force: true})
export const killChildProcesses = async () => {
  for (const childProcess of childProcesses) await childProcess.kill()
  await setTimeout(200)
}

async function getBootstrapNodes() {
  let peerId = await tryAgainIfError(_=> getPeerId(0))
  return  [`/ip4/${config.externalIp}/tcp/10000/p2p/${peerId}`]
}

export async function createApiNodes(count) {
  let bootstrapNodes = []// bootstrapNodes || await getBootstrapNodes()
  const ports = []
  for (let i = 0; i < count; i++) {
    childProcesses.push(await createApiNode({index: i, isLeader: i === 0, bootstrapNodes: JSON.stringify(bootstrapNodes)}))
    ports.push(9000 + i)
    await setTimeout(200)
    if(i === 0) bootstrapNodes = await getBootstrapNodes()
  }
  await waitForBootstrapSync(ports)
  await tryAgainIfError(_=>axios.post(`http://127.0.0.1:${ports[0]}/api/publish/whitelist`))
  await waitForWhitelistSync(ports)
  return ports
}

export async function createApiNode({index, isLeader = false, bootstrapNodes}) {
  const env = Object.assign({}, process.env, {
    PORT: 9000 + index,
    BRIDGE_CONF_DIR: './.e2e/' + index,
    BRIDGE_PORT: config.bridgeNode.port + index,
    BRIDGE_IS_LEADER: isLeader,
    BRIDGE_BOOTSTRAP_NODES: bootstrapNodes,
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

async function getPeerId(i){
  const file = await readFile(filePath(i))
  return JSON.parse(file.toString()).p2p.id
}

async function waitForBootstrapSync(ports) {
  const fn = (port) => async () => {
    const {data: peers} = await axios.get(`http://localhost:${port}/api/peer`)
    return peers.length === ports.length - 1
  }
  await waitToSync(ports.map(fn))
  console.log('bootstrap synced...')
}


export async function waitForWhitelistSync(ports) {
  const fn = (port) => async () => {
    const {data: whitelists} = await axios.get(`http://192.168.1.69:${port}/api/peer/whitelist`)
    return whitelists.length === ports.length
  }
  await waitToSync(ports.map(fn))
  console.log('whitelist synced...')
}

