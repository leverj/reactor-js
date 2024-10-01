import {CodedError, logger} from '@leverj/common'
import {JsonDirStore, tryAgainIfError, waitToSync} from '@leverj/reactor.p2p'
import axios from 'axios'
import {fork} from 'node:child_process'
import {rmSync} from 'node:fs'
import {killAll} from './processes.js'

export class Nodes {
  constructor(config) {
    this.config = config
    this.processes = []
  }
  get bridge() { return this.config.bridge }
  get externalIp() { return this.config.externalIp }
  get leaderPort() { return this.config.port }
  get timeout() { return this.config.timeout }
  get tryCount() { return this.config.tryCount }

  reset() {
    rmSync(this.bridge.nodesDir, {recursive: true, force: true})
    this.store = new JsonDirStore(this.bridge.nodesDir, 'nodes')
    this.processes = []
  }

  async stop() {
    await killAll(this.processes)
    this.processes.length = 0
  }

  get(key) { return this.store.get(key) }
  set(key, value) { this.store.set(key, value) }

  async createApiNode(port) {
    const {store, leaderPort, externalIp, bridge, timeout, tryCount} = this
    const index = port - leaderPort
    const bootstrapNodes = (port === leaderPort) ? [] : await tryAgainIfError(async () => {
      const leader = store.get(leaderPort)?.p2p.id
      if (leader) return [`/ip4/${externalIp}/tcp/${bridge.port}/p2p/${leader}`]
      else throw CodedError(`no leader found @ port ${leaderPort}`, 'ENOENT')
    }, timeout, tryCount, port)
    const env = Object.assign({}, process.env, {
      PORT: port,
      BRIDGE_PORT: bridge.port + index,
      BRIDGE_THRESHOLD: bridge.threshold,
      BRIDGE_CONF_DIR: bridge.nodesDir,
      BRIDGE_BOOTSTRAP_NODES: JSON.stringify(bootstrapNodes),
    })
    return fork('app.js', [], {cwd: process.cwd(), env})
  }

  async createApiNodesFrom(ports, howMany = ports.length - 1) {
    const processes = []
    for (let each of ports) processes.push(await this.createApiNode(each))
    await this.syncOn('peer', ports, howMany)
    return processes
  }

  async waitForWhitelistSync(ports, howMany = ports.length) { return this.syncOn('whitelist', ports, howMany) }

  async syncOn(endpoint, ports, howMany) {
    await waitToSync(
      ports.map(_ => () => this.GET(_, endpoint).then(_ => _.length === howMany)),
      this.tryCount, this.timeout, this.leaderPort
    )
    logger.log(`${endpoint} synced...`)
  }

  async createApiNodes(howMany, whitelist = true) {
    const ports = new Array(howMany).fill(0).map((_, i) => this.leaderPort + i)
    this.processes = await this.createApiNodesFrom(ports)
    if (whitelist) await this.establishWhitelist(ports)
    return ports
  }

  async GET(port, endpoint) {
    return axios.get(`http://127.0.0.1:${port}/api/${endpoint}`).then(_ => _.data)
  }

  async POST(port, endpoint, payload) {
    return axios.post(`http://127.0.0.1:${port}/api/${endpoint}`, payload || {})
  }

  async establishWhitelist(ports, howMany) {
    return tryAgainIfError(
      () => this.POST(this.leaderPort, 'whitelist/publish'),
      this.timeout, this.tryCount, this.leaderPort
    ).then(_ => this.waitForWhitelistSync(ports, howMany))
  }
}
