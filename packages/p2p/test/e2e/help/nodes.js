import {CodedError, logger} from '@leverj/common'
import {JsonDirStore, tryAgainIfError, waitToSync} from '@leverj/reactor.p2p'
import axios from 'axios'
import {fork} from 'node:child_process'
import {rmSync} from 'node:fs'
import {setTimeout} from 'node:timers/promises'
import {killAll} from './processes.js'

export class Nodes {
  constructor(config) {
    this.config = config
    this.processes = []
  }

  get leaderPort() { return this.config.port }

  start() {
    const {bridge: {nodesDir}} = this.config
    rmSync(nodesDir, {recursive: true, force: true})
    this.store = new JsonDirStore(nodesDir, 'nodes')
    this.processes = []
    return this
  }

  async stop() {
    await killAll(this.processes)
    this.processes.length = 0
  }

  get(key) { return this.store.get(key) }

  set(key, value) { this.store.set(key, value) }

  async createApiNode(port) {
    const {externalIp, bridge, messaging: {attempts, timeout}} = this.config
    const index = port - this.leaderPort
    const bootstrapNodes = (port === this.leaderPort) ? [] : await tryAgainIfError(async () => {
      const leader = this.store.get(this.leaderPort)?.p2p.id
      if (leader) return [`/ip4/${externalIp}/tcp/${bridge.port}/p2p/${leader}`]
      else throw CodedError(`no leader found @ port ${this.leaderPort}`, 'ENOENT')
    }, timeout, attempts, port)
    const env = Object.assign({}, process.env, {
      PORT: port,
      BRIDGE_PORT: bridge.port + index,
      BRIDGE_THRESHOLD: bridge.threshold,
      BRIDGE_NODES_DIR: bridge.nodesDir,
      BRIDGE_BOOTSTRAP_NODES: JSON.stringify(bootstrapNodes),
    })
    return fork('app.js', [], {cwd: process.cwd(), env})
  }

  async createNodes() {
    const ports = await this.createApiNodes(this.config.bridge.threshold + 1)
    await this.establishWhitelist(ports)
    const groupPublicKey = await this.establishGroupPublicKey()
    return groupPublicKey
  }

  async createApiNodes(howMany) {
    const ports = new Array(howMany).fill(0).map((_, i) => this.leaderPort + i)
    this.processes = await this.createApiNodesFrom(ports)
    return ports
  }

  async createApiNodesFrom(ports, howMany = ports.length - 1) {
    const processes = []
    for (let each of ports) processes.push(await this.createApiNode(each))
    await this.syncOn('peer', ports, howMany)
    return processes
  }

  async establishWhitelist(ports, howMany) {
    const {messaging: {attempts, timeout}} = this.config
    return tryAgainIfError(
      () => this.POST(this.leaderPort, 'whitelist'), attempts, timeout, this.leaderPort
    ).then(_ => this.syncOn('whitelist', ports, howMany || ports.length))
  }

  async establishGroupPublicKey() {
    await this.POST(this.leaderPort, 'dkg')
    await setTimeout(100)
    return this.get(this.leaderPort).tssNode.groupPublicKey
  }

  async syncOn(endpoint, ports, howMany) {
    const {messaging: {attempts, timeout}} = this.config
    await waitToSync(ports.map(_ => () => this.GET(_, endpoint).then(_ => _.length === howMany)), attempts, timeout, this.leaderPort)
    logger.log(`${endpoint} synced...`)
  }

  async GET(port, endpoint) {
    return axios.get(`http://127.0.0.1:${port}/api/${endpoint}`).then(_ => _.data)
  }

  async POST(port, endpoint, payload) {
    return axios.post(`http://127.0.0.1:${port}/api/${endpoint}`, payload || {})
  }

  async addVault(chainId, address, providerURL) {
    return this.POST(this.leaderPort, 'chain/vault', {chainId, address, providerURL})
  }
}
