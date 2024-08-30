import {logger} from '@leverj/common/utils'
import axios from 'axios'
import {fork} from 'child_process'
import config from 'config'
import {expect} from 'expect'
import {rmSync} from 'node:fs'
import {setTimeout} from 'node:timers/promises'
import {tryAgainIfError, waitToSync} from '../src/utils.js'
import {Store} from '../src/db/Store.js'
import {getNodeInfos} from './fixtures.js'

const {bridgeNode, externalIp, port: leaderPort} = config

describe('e2e', () => {
  const store = Store.JsonDir(bridgeNode.confDir, 'Info')
  const processes = {}

  beforeEach(async () => await store.clear())
  afterEach(async () => await stop())
  after(() => rmSync(bridgeNode.confDir, {recursive: true, force: true}))

  async function stop(ports = Array.from(Object.keys(processes))) {
    ports.forEach(_ => { processes[_].kill(); delete processes[_]})
    await setTimeout(100)
  }

  async function createApiNodesFrom(ports, howMany = ports.length - 1) {
    const createApiNode = async (port) => {
      const index = port - leaderPort
      const bootstrapNodes = port === leaderPort ?
        [] :
        await tryAgainIfError(async _ => {
          const leader = (await store.get(leaderPort))?.p2p.id
          if (leader) return [`/ip4/${externalIp}/tcp/${bridgeNode.port}/p2p/${leader}`]
          else {
            const e = Error(`no leader found @ port ${leaderPort}`)
            e.code = 'ENOENT' //fixme: what is the expected error code / failure here?
            throw e
          }
        })
      const env = Object.assign({}, process.env, {
        PORT: port,
        BRIDGE_PORT: bridgeNode.port + index,
        BRIDGE_CONF_DIR: bridgeNode.confDir,
        BRIDGE_BOOTSTRAP_NODES: JSON.stringify(bootstrapNodes),
      })
      return fork('app.js', [], {cwd: process.cwd(), env})
    }

    for (let each of ports) {
      processes[each] = await createApiNode(each)
      await setTimeout(100)
    }
    await waitToSync(ports.map(_ => async () => GET(_, 'peer').then(_ => _.length === howMany)))
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
    for (let [i, info] of getNodeInfos(howMany).entries()) await store.set(leaderPort + i, info)
  }
  const GET = (port, endpoint) => axios.get(`http://127.0.0.1:${port}/api/${endpoint}`).then(_ => _.data)
  const POST = (port, endpoint, payload) => axios.post(`http://127.0.0.1:${port}/api/${endpoint}`, payload || {})

  async function waitForWhitelistSync(ports, howMany = ports.length) {
    await waitToSync(ports.map(_ => async () => GET(_, 'whitelist').then(_ => _.length === howMany)))
    logger.log('whitelisted synced...')
  }

  const publishWhitelist = async (ports, total, available) =>
    tryAgainIfError(_ => POST(leaderPort, 'whitelist/publish')).then(_ => waitForWhitelistSync(ports, total, available))

  it('should create new nodes, connect and init DKG', async () => {
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

  it('should be able to create node with already existing info.json', async () => {
    await createNodeInfos(3)
    const infos = getNodeInfos(3)
    const ports = await createApiNodes(3)
    for (let [i, port] of ports.entries()) expect(await store.get(port)).toEqual(infos[i])
  })

  it('aggregate signatures over pubsub topic', async () => {
    await createNodeInfos(4)
    await createApiNodes(4)
    const message = 'hash123456'
    await POST(leaderPort, 'tss/aggregateSign', {message})
    await setTimeout(200)
    expect(await GET(leaderPort, `tss/aggregateSign?transferHash=${message}`).then(_ => _.verified)).toEqual(true)
  })

  it('whitelist', async () => {
    const ports = await createApiNodes(4, false)
    await GET(leaderPort + 1, 'peer/bootstrapped')
    await stop(ports.slice(2))
    await publishWhitelist(ports.slice(0, 2), 4)
    expect((await store.get(ports[0])).whitelist).toHaveLength(4)
    expect((await store.get(ports[1])).whitelist).toHaveLength(4)
    expect((await store.get(ports[2])).whitelist).toHaveLength(1)
    expect((await store.get(ports[3])).whitelist).toHaveLength(1)

    await createApiNodesFrom(ports.slice(2), 3)
    await waitForWhitelistSync(ports)
    expect((await store.get(ports[0])).whitelist).toHaveLength(4)
    expect((await store.get(ports[1])).whitelist).toHaveLength(4)
    expect((await store.get(ports[2])).whitelist).toHaveLength(4)
    expect((await store.get(ports[3])).whitelist).toHaveLength(4)
  })
})
