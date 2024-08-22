import {logger} from '@leverj/common/utils'
import axios from 'axios'
import {fork} from 'child_process'
import config from 'config'
import {expect} from 'expect'
import {existsSync, mkdirSync, readFileSync, rmdirSync, writeFileSync} from 'node:fs'
import {setTimeout} from 'node:timers/promises'
import {tryAgainIfError, waitToSync} from '../src/utils/index.js'
import {getNodeInfos} from './help/fixtures.js'

const {bridgeNode, externalIp} = config
const e2ePath = `${process.cwd()}/../../data/.e2e`
const leaderPort = config.port

const dirPath = (port) => `${e2ePath}/${port}`
const filePath = (port) => `${dirPath(port)}/info.json`
const getInfo = (port) => JSON.parse(readFileSync(filePath(port)).toString())
const setInfo = (port, info) => {
  if (!existsSync(dirPath(port))) mkdirSync(dirPath(port), {recursive: true})
  writeFileSync(filePath(port), JSON.stringify(info))
}

const GET = (port, endpoint) => axios.get(`http://127.0.0.1:${port}/api/${endpoint}`).then(_ => _.data)
const POST = (port, endpoint, payload) => axios.post(`http://127.0.0.1:${port}/api/${endpoint}`, payload || {})

async function waitForWhitelistSync(ports, howMany = ports.length) {
  await waitToSync(ports.map(_ => async () => GET(_, 'whitelist').then(_ => _.length === howMany)))
  logger.log('whitelisted synced...')
}

const publishWhitelist = async (ports, total, available) =>
  tryAgainIfError(_ => POST(leaderPort, 'whitelist/publish')).then(_ => waitForWhitelistSync(ports, total, available))

const createNodeInfos = (howMany) => getNodeInfos(howMany).forEach((info, i) => setInfo(leaderPort + i, info))

describe.only('e2e', () => {
  const processes = {}

  beforeEach(async () => {
    mkdirSync(e2ePath, {recursive: true})
  })
  afterEach(async () => {
    await stop()
    rmdirSync(e2ePath, {recursive: true, force: true})
  })

  async function stop(ports = Array.from(Object.keys(processes))) {
    for (let each of ports) {
      processes[each].kill()
      delete processes[each]
    }
    await setTimeout(100)
  }

  async function createApiNodesFrom(ports, howMany = ports.length - 1) {
    const createApiNode = async (port) => {
      const index = port - leaderPort
      const bootstrapNodes = port === leaderPort ?
        [] :
        await tryAgainIfError(_ => getInfo(leaderPort).p2p.id).then(leader => [`/ip4/${externalIp}/tcp/${bridgeNode.port}/p2p/${leader}`])
      const env = Object.assign({}, process.env, {
        PORT: port,
        BRIDGE_PORT: bridgeNode.port + index,
        BRIDGE_BOOTSTRAP_NODES: JSON.stringify(bootstrapNodes),
      })
      return fork('app.js', [], {cwd: process.cwd(), env})
    }

    for (let each of ports) {
      processes[each] = await createApiNode(each)
      await setTimeout(10)
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

  it('should create new nodes, connect and init DKG', async () => {
    const ports = await createApiNodes(2)
    await POST(leaderPort, 'dkg/start')
    await setTimeout(100)
    const publicKeys = ports.map(_ => getInfo(_).tssNode.groupPublicKey)
    for (let each of publicKeys) {
      expect(each).not.toBeNull()
      expect(each).toEqual(publicKeys[0])
    }
  })

  it('should be able to create node with already existing info.json', async () => {
    await createNodeInfos(3)
    const infos = getNodeInfos(3)
    const ports = await createApiNodes(3)
    for (let [i, port] of ports.entries()) expect(getInfo(port)).toEqual(infos[i])
  })

  it('aggregate signatures over pubsub topic', async () => {
    await createNodeInfos(4)
    await createApiNodes(4)
    const txnHash = 'hash123456'
    await POST(leaderPort, 'tss/aggregateSign', {msg: txnHash})
    await setTimeout(100)
    expect(await GET(leaderPort, `tss/aggregateSign?txnHash=${txnHash}`).then(_ => _.verified)).toEqual(true)
  })

  it('whitelist', async () => {
    const ports = await createApiNodes(4, false)
    await GET(leaderPort + 1, 'peer/bootstrapped')
    await stop(ports.slice(2))
    await publishWhitelist(ports.slice(0, 2), 4)
    expect(getInfo(ports[0]).whitelist).toHaveLength(4)
    expect(getInfo(ports[1]).whitelist).toHaveLength(4)
    expect(getInfo(ports[2]).whitelist).toHaveLength(1)
    expect(getInfo(ports[3]).whitelist).toHaveLength(1)

    await createApiNodesFrom(ports.slice(2), 3)
    await waitForWhitelistSync(ports)
    expect(getInfo(ports[0]).whitelist).toHaveLength(4)
    expect(getInfo(ports[1]).whitelist).toHaveLength(4)
    expect(getInfo(ports[2]).whitelist).toHaveLength(4)
    expect(getInfo(ports[3]).whitelist).toHaveLength(4)
  })
})
