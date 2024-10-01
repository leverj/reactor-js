import {CodedError, logger} from '@leverj/common'
import {tryAgainIfError, waitToSync} from '@leverj/reactor.p2p'
import axios from 'axios'
import {fork} from 'node:child_process'
import {setTimeout} from 'node:timers/promises'

async function createApiNode(config, store, port) {
  const {bridge, externalIp, timeout, tryCount, port: leaderPort} = config

  const getLeaderNode = async () => {
    const leader = store.get(leaderPort)?.p2p.id
    if (leader) return [`/ip4/${externalIp}/tcp/${bridge.port}/p2p/${leader}`]
    else throw CodedError(`no leader found @ port ${leaderPort}`, 'ENOENT')
  }

  const index = port - leaderPort
  const bootstrapNodes = port === leaderPort ? [] : await tryAgainIfError(getLeaderNode, timeout, tryCount, port)
  const env = Object.assign({}, process.env, {
    PORT: port,
    BRIDGE_PORT: bridge.port + index,
    BRIDGE_THRESHOLD: bridge.threshold,
    BRIDGE_CONF_DIR: bridge.nodesDir,
    BRIDGE_BOOTSTRAP_NODES: JSON.stringify(bootstrapNodes),
  })
  return fork('app.js', [], {cwd: process.cwd(), env})
}

export async function createApiNodesFrom(config, store, ports, howMany = ports.length - 1) {
  const processes = []
  const {timeout, tryCount, port} = config
  for (let each of ports) processes.push(await createApiNode(config, store, each))
  await waitToSync(ports.map(_ => async () => GET(_, 'peer').then(_ => _.length === howMany)), tryCount, timeout, port)
  logger.log('bootstrap synced...')
  return processes
}

export async function createApiNodes(config, store, howMany, whitelist = true) {
  const leaderPort = config.port
  const ports = new Array(howMany).fill(0).map((_, i) => leaderPort + i)
  const processes = await createApiNodesFrom(config, store, ports)
  if (whitelist) await establishWhitelist(config, ports)
  return {ports, processes}
}

export const GET = (port, endpoint) => axios.get(`http://127.0.0.1:${port}/api/${endpoint}`).then(_ => _.data)
export const POST = (port, endpoint, payload) => axios.post(`http://127.0.0.1:${port}/api/${endpoint}`, payload || {})

export async function waitForWhitelistSync(config, ports, howMany = ports.length) {
  const {timeout, tryCount, port: leaderPort} = config
  await waitToSync(ports.map(_ => async () => GET(_, 'whitelist').then(_ => _.length === howMany)), tryCount, timeout, leaderPort)
  logger.log('whitelisted synced...')
}

export async function establishWhitelist(config, ports, howMany) {
  const {timeout, tryCount, port: leaderPort} = config
  return tryAgainIfError(_ => POST(leaderPort, 'whitelist/publish'), timeout, tryCount, leaderPort).then(_ => waitForWhitelistSync(config, ports, howMany))
}

export async function killAll(processes) {
  for (let each of processes) {
    each.kill()
    while(!each.killed) await setTimeout(10)
  }
}
