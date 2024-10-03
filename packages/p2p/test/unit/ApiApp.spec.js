import {CodedError, InMemoryStore, logger} from '@leverj/common'
import {ApiApp, tryAgainIfError, waitToSync} from '@leverj/reactor.p2p'
import config from '@leverj/reactor.p2p/config'
import axios from 'axios'
import {expect} from 'expect'
import {merge} from 'lodash-es'
import {setTimeout} from 'node:timers/promises'
import {getNodeInfos} from '../fixtures.js'

const {bridge, externalIp, port: leaderPort, messaging: {attempts, timeout}} = config

describe('ApiApp', () => {
  let store, nodes = []

  beforeEach(() => store = new InMemoryStore())
  afterEach(async () => { while (nodes.length > 0) await nodes.pop().stop() })

  async function createApiNode(port) {
    const index = port - leaderPort
    const getLeaderNode = async _ => {
      const leader = store.get(leaderPort)?.p2p.id
      if (leader) return [`/ip4/${externalIp}/tcp/${bridge.port}/p2p/${leader}`]
      else throw CodedError(`no leader found @ port ${leaderPort}`, 'ENOENT')
    }
    const bootstrapNodes = port === leaderPort ? [] : await tryAgainIfError(getLeaderNode, timeout, attempts, port)
    const p2pConfig = merge({}, config, {port, bridge: {port: bridge.port + index, bootstrapNodes}})
    return ApiApp.with(p2pConfig, store).then(_ => _.start())
  }

  async function createApiNodesFrom(ports, howMany = ports.length - 1) {
    logger.log('#'.repeat(50), 'creating nodes', ports)
    for (let each of ports) {
      nodes.push(await createApiNode(each))
      logger.log('#'.repeat(50), 'created node', each, nodes.length)
    }
    await setTimeout(10)
    await waitToSync(ports.map(_ => async () => GET(_, 'peer').then(_ => _.length === howMany)), attempts, timeout, leaderPort)
    logger.log('bootstrap synced...')
    return ports
  }

  async function createApiNodes(howMany) {
    const ports = new Array(howMany).fill(0).map((_, i) => leaderPort + i)
    await createApiNodesFrom(ports)
    await establishWhitelist(ports)
    return ports
  }

  const createNodeInfos = async (howMany) => {
    for (let [i, info] of getNodeInfos(howMany).entries()) store.set(leaderPort + i, info)
  }
  const GET = (port, endpoint) => axios.get(`http://localhost:${port}/api/${endpoint}`).then(_ => _.data)
  const POST = (port, endpoint, payload) => axios.post(`http://localhost:${port}/api/${endpoint}`, payload || {})

  async function waitForWhitelistSync(ports, howMany = ports.length) {
    await waitToSync(ports.map(_ => async () => GET(_, 'whitelist').then(_ => _.length === howMany)), attempts, timeout, leaderPort)
    logger.log('whitelisted synced...')
  }

  const establishWhitelist = async (ports, total, available) =>
    tryAgainIfError(_ => POST(leaderPort, 'whitelist'), timeout, attempts, leaderPort).
    then(_ => waitForWhitelistSync(ports, total, available))

  it('create new nodes, connect and init DKG', async () => {
    const ports = await createApiNodes(2)
    await POST(leaderPort, 'dkg')
    await setTimeout(100)
    const nodes = await Promise.all(ports.map(_ => store.get(_)))
    const publicKeys = nodes.map(_ => _.tssNode.groupPublicKey)
    for (let each of publicKeys) {
      expect(each).not.toBeNull()
      expect(each).toEqual(publicKeys[0])
    }
  })

  it('can create node with already existing info.json', async () => {
    await createNodeInfos(3)
    const infos = getNodeInfos(3)
    const ports = await createApiNodes(3)
    for (let [i, port] of ports.entries()) expect(store.get(port)).toEqual(infos[i])
  })

  it('whitelist', async () => {
    const howMany = 4
    const ports = new Array(howMany).fill(0).map((_, i) => leaderPort + i)
    await createApiNodesFrom(ports)
    await GET(leaderPort + 1, 'peer/bootstrapped')
    for (let each of nodes.slice(2)) await each.stop()

    await setTimeout(10)
    await establishWhitelist(ports.slice(0, 2), howMany)
    expect(store.get(ports[0]).whitelist).toHaveLength(howMany)
    expect(store.get(ports[1]).whitelist).toHaveLength(howMany)
    expect(store.get(ports[2]).whitelist).toHaveLength(1)
    expect(store.get(ports[3]).whitelist).toHaveLength(1)

    await setTimeout(10)
    await createApiNodesFrom(ports.slice(2), 3)
    await waitForWhitelistSync(ports)
    expect(store.get(ports[0]).whitelist).toHaveLength(howMany)
    expect(store.get(ports[1]).whitelist).toHaveLength(howMany)
    expect(store.get(ports[2]).whitelist).toHaveLength(howMany)
    expect(store.get(ports[3]).whitelist).toHaveLength(howMany)
  })
})
