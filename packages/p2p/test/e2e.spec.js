import {expect} from 'expect'
import JSONStore from 'json-store'
import {mkdirSync, rmdirSync} from 'node:fs'
import {setTimeout} from 'node:timers/promises'
import {getNodeInfos} from './help/fixtures.js'
import {
  createApiNodes,
  createFrom,
  createNodeInfos,
  e2ePath,
  GET,
  getInfo,
  POST,
  publishWhitelist,
  stop,
  waitForWhitelistSync,
} from './help/e2e.js'

describe('e2e', () => {
  let store

  beforeEach(async () => {
    mkdirSync(e2ePath, {recursive: true})
    store = JSONStore(`${e2ePath}/info.json`)
  })
  afterEach(async () => {
    await stop()
    rmdirSync(e2ePath, {recursive: true, force: true})
  })

  it('should create new nodes, connect and init DKG', async () => {
    const ports = await createApiNodes(2)
    await POST(9000, 'dkg/start')
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
    for (let [i, port] of Object.entries(ports)) expect(getInfo(port)).toEqual(infos[i])
  })

  it('aggregate signatures over pubsub topic', async () => {
    await createNodeInfos(4)
    await createApiNodes(4)
    const txnHash = 'hash123456'
    await POST(9000, 'tss/aggregateSign', {msg: txnHash})
    await setTimeout(100)
    expect(await GET(9000, `tss/aggregateSign?txnHash=${txnHash}`).then(_ => _.verified)).toEqual(true)
  })

  it('whitelist', async () => {
    const ports = await createApiNodes(4, false)
    await GET(9001, 'peer/bootstrapped')
    await stop(ports.slice(2))
    await publishWhitelist(ports.slice(0, 2), 4)
    expect(getInfo(ports[0]).whitelist).toHaveLength(4)
    expect(getInfo(ports[1]).whitelist).toHaveLength(4)
    expect(getInfo(ports[2]).whitelist).toHaveLength(1)
    expect(getInfo(ports[3]).whitelist).toHaveLength(1)

    await createFrom(ports.slice(2), 3)
    await waitForWhitelistSync(ports)
    expect(getInfo(ports[0]).whitelist).toHaveLength(4)
    expect(getInfo(ports[1]).whitelist).toHaveLength(4)
    expect(getInfo(ports[2]).whitelist).toHaveLength(4)
    expect(getInfo(ports[3]).whitelist).toHaveLength(4)
  })
})
