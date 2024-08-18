import {logger} from '@leverj/common/utils'
import axios from 'axios'
import {fork} from 'child_process'
import config from 'config'
import {expect} from 'expect'
import {mkdirSync, readFileSync, rmdirSync, writeFileSync} from 'node:fs'
import {setTimeout} from 'node:timers/promises'
import path from 'path'
import {tryAgainIfError, waitToSync} from '../src/utils/index.js'
import {getBridgeInfos} from './help/fixtures.js'

const {bridgeNode, externalIp} = config
const __dirname = process.cwd()
const e2ePath = path.join(__dirname, '.e2e')

describe('e2e', () => {
  const processes = {}

  afterEach(async () => await stop(...Object.keys(processes)).then(_ => rmdirSync(e2ePath, {recursive: true, force: true})))

  const dirPath = (i) => path.join(e2ePath, i.toString())
  const filePath = (i) => path.join(dirPath(i), 'info.json')

  const stop = async (...ports) => {
    for (let each of ports) {
      await processes[each].kill()
      delete processes[each]
    }
    await setTimeout(10)
  }

  async function getBootstrapNodes() {
    const leader = await tryAgainIfError(_ => JSON.parse(readFileSync(filePath(0)).toString()).p2p.id)
    return [`/ip4/${externalIp}/tcp/10000/p2p/${leader}`]
  }

  async function publishWhitelist(ports, total, available) {
    await tryAgainIfError(_ => axios.post(`http://127.0.0.1:${ports[0]}/api/whitelist/publish`))
    await waitForWhitelistSync(ports, total, available)
  }

  async function createFrom(ports, count) {
    for (let each of ports) {
      const index = each - 9000
      const bootstrapNodes = index === 0 ? [] : await getBootstrapNodes()
      processes[each] = await createApiNode({
        index,
        isLeader: index === 0,
        bootstrapNodes: JSON.stringify(bootstrapNodes),
      })
      await setTimeout(100)
    }
    await waitForBootstrapSync(ports, count)
    return ports
  }

  async function createApiNodes(count, whitelist = true) {
    const ports = new Array(count).fill(0).map((_, i) => 9000 + i)
    await createFrom(ports)
    if (whitelist) await publishWhitelist(ports)
    return ports
  }

  async function createApiNode({index, isLeader = false, bootstrapNodes}) {
    const env = Object.assign({}, process.env, {
      PORT: 9000 + index,
      BRIDGE_CONF_DIR: './.e2e/' + index,
      BRIDGE_PORT: bridgeNode.port + index,
      BRIDGE_IS_LEADER: isLeader,
      BRIDGE_BOOTSTRAP_NODES: bootstrapNodes,
      CONTRACT_TESTING: false,
    })
    mkdirSync(env.BRIDGE_CONF_DIR, {recursive: true})
    return fork(`app.js`, [], {cwd: __dirname, env})
  }

  async function createInfo_json(count) {
    for (let [i, info] of Object.entries(getBridgeInfos(count))) {
      mkdirSync(dirPath(i), {recursive: true})
      writeFileSync(filePath(i), JSON.stringify(info, null, 2))
    }
  }

  async function waitForBootstrapSync(ports, count = ports.length - 1) {
    const fn = (port) => async () => {
      const {data: peers} = await axios.get(`http://127.0.0.1:${port}/api/peer`)
      return peers.length === count
    }
    await waitToSync(ports.map(fn))
    logger.log('bootstrap synced...')
  }

  async function waitForWhitelistSync(ports, total = ports.length) {
    const getWhitelist = async (port) => axios.get(`http://127.0.0.1:${port}/api/whitelist`).then(_ => _.data)
    const fn = (port) => async () => getWhitelist(port).then(_ => _.length === total)
    await waitToSync(ports.map(fn))
    logger.log('whitelisted synced...')
  }

  it('should create new nodes, connect and init DKG', async () => {
    const startDkg = async () => axios.post(`http://127.0.0.1:9000/api/dkg/start`)
    const getPublicKey = (port) => JSON.parse(readFileSync(filePath(port - 9000)).toString()).tssNode.groupPublicKey

    const allNodes = await createApiNodes(2)
    await startDkg()
    await setTimeout(100)
    const publicKeys = allNodes.map(node => getPublicKey(node))
    for (let each of publicKeys) {
      expect(each).not.toBeNull()
      expect(each).toEqual(publicKeys[0])
    }
  })

  it('should be able to create node with already existing info.json', async () => {
    const getInfo = (port) => JSON.parse(readFileSync(filePath(port - 9000)).toString())

    const nodes = [9000, 9001, 9002]
    await createInfo_json(nodes.length)
    const bridgeInfos = getBridgeInfos(nodes.length)
    await createApiNodes(nodes.length)
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      const info = getInfo(node)
      expect(info).toEqual(bridgeInfos[i])
    }
  })

  it('aggregate signatures over pubsub topic', async () => {
    const message = 'hello world'
    const allNodes = [9000, 9001, 9002, 9003]
    await createInfo_json(allNodes.length)

    await createApiNodes(allNodes.length)
    const txnHash = 'hash123456'
    await axios.post('http://127.0.0.1:9000/api/tss/aggregateSign', {txnHash, 'msg': message})
    const fn = async () => {
      const {data: {verified}} = await axios.get('http://127.0.0.1:9000/api/tss/aggregateSign?txnHash=' + txnHash)
      return verified
    }
    await waitToSync([fn], 200)
    const {data: {verified}} = await axios.get('http://127.0.0.1:9000/api/tss/aggregateSign?txnHash=' + txnHash)
    expect(verified).toEqual(true)
  })

  describe('stability', () => {
    it('whitelist', async () => {
      const getWhitelists = (port) => JSON.parse(readFileSync(filePath(port - 9000)).toString()).whitelist

      const ports = await createApiNodes(4, false)
      await axios.get(`http://127.0.0.1:9001/api/peer/bootstrapped`)
      await stop(...ports.slice(2))
      await publishWhitelist(ports.slice(0, 2), 4)
      expect(getWhitelists(ports[0]).length).toEqual(4)
      expect(getWhitelists(ports[1]).length).toEqual(4)
      expect(getWhitelists(ports[2]).length).toEqual(1)
      expect(getWhitelists(ports[3]).length).toEqual(1)
      await createFrom(ports.slice(2), 3)
      await waitForWhitelistSync(ports)
      expect(getWhitelists(ports[0]).length).toEqual(4)
      expect(getWhitelists(ports[1]).length).toEqual(4)
      expect(getWhitelists(ports[2]).length).toEqual(4)
      expect(getWhitelists(ports[3]).length).toEqual(4)
    })
  })
})
