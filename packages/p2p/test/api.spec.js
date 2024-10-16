import {CodedError, logger} from '@leverj/common'
import axios from 'axios'
import {cloneDeep} from 'lodash-es'
import {expect} from 'expect'
import {rmSync} from 'node:fs'
import {setTimeout} from 'node:timers/promises'
import {ApiApp, JsonDirStore} from '../src/ApiApp.js'
import {tryAgainIfError, waitToSync} from '../src/utils.js'
import config from '../config.js'
import {getNodeInfos} from './fixtures.js'

const {bridge, externalIp, timeout, tryCount, port: leaderPort} = config

describe.skip('api ', () => {
  const nodes = []
  let store

  beforeEach(() => {
    rmSync(bridge.confDir, {recursive: true, force: true})
    store = new JsonDirStore(bridge.confDir, 'nodes')
  })
  afterEach(async () => {
    console.log('#'.repeat(50), 'stopping nodes', nodes.length)
    while (nodes.length > 0) {
      console.log('#'.repeat(50), 'stopping node')
      await nodes.pop().stop()
    }
    await setTimeout(1000)
  })

  async function createApiNodesFrom(ports, howMany = ports.length - 1) {
    const createApiNode = async (port) => {
      const index = port - leaderPort
      const getLeaderNode = async _ => {
        const leader = store.get(leaderPort)?.p2p.id
        if (leader) return [`/ip4/${externalIp}/tcp/${bridge.port}/p2p/${leader}`]
        else throw CodedError(`no leader found @ port ${leaderPort}`, 'ENOENT')
      }
      const bootstrapNodes = port === leaderPort ? [] : await tryAgainIfError(getLeaderNode, timeout, tryCount, port)
      const clonedConfig = cloneDeep(config)
      clonedConfig.port = port
      clonedConfig.bridge.port = bridge.port + index
      clonedConfig.bridge.bootstrapNodes = bootstrapNodes
      const node =  await ApiApp.new(clonedConfig)
      node.start()
      return node
    }
    console.log('#'.repeat(50), 'creating nodes', ports)
    for (let each of ports) {
      nodes.push(await createApiNode(each))
      console.log('#'.repeat(50), 'created node', each, nodes.length)
      await setTimeout(100)
    }
    await waitToSync(ports.map(_ => async () => GET(_, 'peer').then(_ => _.length === howMany)), tryCount, timeout, leaderPort)
    logger.log('bootstrap synced...')
    return ports
  }

  async function createApiNodes(howMany, whitelist = true) {
    const ports = new Array(howMany).fill(0).map((_, i) => leaderPort + i)
    await createApiNodesFrom(ports)
    if (whitelist) await publishWhitelist(ports)
    return ports
  }

  const createNodeInfos = async (howMany) => {
    for (let [i, info] of getNodeInfos(howMany).entries()) store.set(leaderPort + i, info)
  }
  const GET = (port, endpoint) => axios.get(`http://127.0.0.1:${port}/api/${endpoint}`).then(_ => _.data)
  const POST = (port, endpoint, payload) => axios.post(`http://127.0.0.1:${port}/api/${endpoint}`, payload || {})

  async function waitForWhitelistSync(ports, howMany = ports.length) {
    await waitToSync(ports.map(_ => async () => GET(_, 'whitelist').then(_ => _.length === howMany)), tryCount, timeout, leaderPort)
    logger.log('whitelisted synced...')
  }

  const publishWhitelist = async (ports, total, available) =>
    tryAgainIfError(_ => POST(leaderPort, 'whitelist/publish'), timeout, tryCount, leaderPort).then(_ => waitForWhitelistSync(ports, total, available))

  it('create new nodes, connect and init DKG', async () => {
    const ports = await createApiNodes(2)
    await POST(leaderPort, 'dkg/start')
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

  it('aggregate signatures over pubsub topic', async () => {
    await createNodeInfos(4)
    await createApiNodes(4)
    const message = 'hash123456'
    await POST(leaderPort, 'tss/aggregateSign', {message})
    await setTimeout(5000)
    expect(await GET(leaderPort, `tss/aggregateSign?transferHash=${message}`).then(_ => _.verified)).toEqual(true)
  })

  it('whitelist', async () => {
    const ports = await createApiNodes(4, false)
    await GET(leaderPort + 1, 'peer/bootstrapped')
    const _processes_ = nodes.slice(2)
    while (_processes_.length > 0) _processes_.pop().kill()
    await setTimeout(100)
    await publishWhitelist(ports.slice(0, 2), 4)
    expect(store.get(ports[0]).whitelist).toHaveLength(4)
    expect(store.get(ports[1]).whitelist).toHaveLength(4)
    expect(store.get(ports[2]).whitelist).toHaveLength(1)
    expect(store.get(ports[3]).whitelist).toHaveLength(1)

    await createApiNodesFrom(ports.slice(2), 3)
    await waitForWhitelistSync(ports)
    expect(store.get(ports[0]).whitelist).toHaveLength(4)
    expect(store.get(ports[1]).whitelist).toHaveLength(4)
    expect(store.get(ports[2]).whitelist).toHaveLength(4)
    expect(store.get(ports[3]).whitelist).toHaveLength(4)
  })
})
