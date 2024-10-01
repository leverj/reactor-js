import {JsonDirStore} from '@leverj/reactor.p2p'
import config from '@leverj/reactor.p2p/config'
import {expect} from 'expect'
import {rmSync} from 'node:fs'
import {setTimeout} from 'node:timers/promises'
import {getNodeInfos} from '../fixtures.js'
import {
  createApiNodes,
  createApiNodesFrom,
  establishWhitelist,
  GET, killAll,
  POST,
  waitForWhitelistSync,
} from './help/nodes.js'

const {bridge, port: leaderPort} = config

describe('e2e - app', () => {
  let store, ports, processes = []

  beforeEach(() => {
    rmSync(bridge.nodesDir, {recursive: true, force: true})
    store = new JsonDirStore(bridge.nodesDir, 'nodes')
  })

  afterEach(async () => {
    await killAll(processes)
    processes.length = 0
  })

  it('create new nodes, connect and init DKG', async () => {
    ({ports, processes} = await createApiNodes(config, store, 2))
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
    const howMany = 3
    for (let [i, info] of getNodeInfos(howMany).entries()) store.set(leaderPort + i, info)
    const infos = getNodeInfos(howMany)
    ;({ports, processes} = await createApiNodes(config, store, howMany))
    for (let [i, port] of ports.entries()) expect(store.get(port)).toEqual(infos[i])
  })

  //fixme: fails when being run with all tests
  it.skip('whitelist', async () => {
    ({ports, processes} = await createApiNodes(config, store, 4, false))
    await GET(leaderPort + 1, 'peer/bootstrapped')
    await killAll(processes.slice(2))
    await establishWhitelist(config, ports.slice(0, 2), 4)
    expect(store.get(ports[0]).whitelist).toHaveLength(4)
    expect(store.get(ports[1]).whitelist).toHaveLength(4)
    expect(store.get(ports[2]).whitelist).toHaveLength(1)
    expect(store.get(ports[3]).whitelist).toHaveLength(1)

    const _processes_ = await createApiNodesFrom(config, store, ports.slice(2), 3)
    try {
      await waitForWhitelistSync(config, ports)
      expect(store.get(ports[0]).whitelist).toHaveLength(4)
      expect(store.get(ports[1]).whitelist).toHaveLength(4)
      expect(store.get(ports[2]).whitelist).toHaveLength(4)
      expect(store.get(ports[3]).whitelist).toHaveLength(4)
    } finally {
      await killAll(_processes_)
    }
  })
})
