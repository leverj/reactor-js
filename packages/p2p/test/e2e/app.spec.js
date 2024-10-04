import config from '@leverj/reactor.p2p/config'
import {expect} from 'expect'
import {setTimeout} from 'node:timers/promises'
import {getNodeInfos} from '../fixtures.js'
import {Nodes} from './help/nodes.js'
import {killAll} from './help/processes.js'

describe('e2e - app', () => {
  let nodes

  before(() => nodes = new Nodes(config))
  beforeEach(() => nodes.start())
  afterEach(async () => await nodes.stop())

  it('create new nodes, connect and init DKG', async () => {
    const ports = await nodes.createApiNodes(2)
    await nodes.establishWhitelist(ports)
    const publicKey = await nodes.establishGroupPublicKey()
    const publicKeys = ports.map(_ => nodes.get(_).tssNode.groupPublicKey)
    for (let each of publicKeys) {
      expect(each).not.toBeNull()
      expect(each).toEqual(publicKey)
    }
  })

  it('can create node with already existing info.json', async () => {
    const howMany = 3
    for (let [i, info] of getNodeInfos(howMany).entries()) nodes.set(nodes.leaderPort + i, info)
    const infos = getNodeInfos(howMany)
    const ports = await nodes.createApiNodes(howMany)
    await nodes.establishWhitelist(ports)
    for (let [i, port] of ports.entries()) expect(nodes.get(port)).toEqual(infos[i])
  })

  it('whitelist', async () => {
    const howMany = 4
    const ports = await nodes.createApiNodes(howMany)
    await nodes.GET(nodes.leaderPort + 1, 'peer/bootstrapped')
    await killAll(nodes.processes.slice(2))

    await nodes.establishWhitelist(ports.slice(0, 2), howMany)
    await setTimeout(100)
    expect(nodes.get(ports[0]).whitelist).toHaveLength(howMany)
    expect(nodes.get(ports[1]).whitelist).toHaveLength(howMany)
    expect(nodes.get(ports[2]).whitelist).toHaveLength(1)
    expect(nodes.get(ports[3]).whitelist).toHaveLength(1)

    const _processes_ = await nodes.createApiNodesFrom(ports.slice(2), 3)
    try {
      await nodes.syncOn('whitelist', ports, howMany)
      expect(nodes.get(ports[0]).whitelist).toHaveLength(howMany)
      expect(nodes.get(ports[1]).whitelist).toHaveLength(howMany)
      expect(nodes.get(ports[2]).whitelist).toHaveLength(howMany)
      expect(nodes.get(ports[3]).whitelist).toHaveLength(howMany)
    } finally {
      await killAll(_processes_)
    }
  })
})
