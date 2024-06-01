import {setTimeout} from 'timers/promises'
import axios from 'axios'
import {expect} from 'expect'
import {getBridgeInfos} from './help/index.js'
import {tryAgainIfConnectionError, waitToSync} from '../src/utils.js'
import {createApiNodes, createFrom, createInfo_json, deleteInfoDir, getInfo, getPublicKey, getWhitelists, killChildProcesses, publishWhitelist, startDkg, stop, waitForWhitelistSync} from './help/e2e.js'

const message = 'hello world'
describe('e2e', function () {
  beforeEach(deleteInfoDir)
  afterEach(killChildProcesses)

  it('should create new nodes, connect and init DKG', async function () {
    const allNodes = await createApiNodes(2)
    await startDkg()
    await setTimeout(1000)
    const publicKeys = await Promise.all(allNodes.map(node => getPublicKey(node)))
    for (const publicKey of publicKeys) {
      expect(publicKey).not.toBeNull()
      expect(publicKey).toEqual(publicKeys[0])
    }
  })

  it('should be able to create node with already existing info.json', async function () {
    const nodes = [9000, 9001, 9002]
    await createInfo_json(nodes.length)
    const bridgeInfos = getBridgeInfos(nodes.length)
    await createApiNodes(nodes.length)
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      const info = await getInfo(node)
      expect(info).toEqual(bridgeInfos[i])
      // await axios.get(`http://127.0.0.1:${node}/api/peer/bootstrapped`)
    }
  })

  it('aggregate signatures over pubsub topic', async function () {
    const allNodes = [9000, 9001, 9002, 9003]
    await createInfo_json(allNodes.length)

    await createApiNodes(allNodes.length)
    // await setTimeout(2000)
    const txnHash = 'hash123456'
    await axios.post('http://localhost:9000/api/tss/aggregateSign', {txnHash, 'msg': message})
    const fn = async () => {
      const {data: {verified}} = await axios.get('http://localhost:9000/api/tss/aggregateSign?txnHash=' + txnHash)
      return verified
    }
    await waitToSync([fn], 200)
    const {data: {verified}} = await axios.get('http://localhost:9000/api/tss/aggregateSign?txnHash=' + txnHash)
    expect(verified).toEqual(true)
  })

  describe('stability', function () {
    it('whitelist', async function () {
      const ports = await createApiNodes(4, false)
      await axios.get(`http://127.0.0.1:9001/api/peer/bootstrapped`)
      await stop(...ports.slice(2))
      await publishWhitelist(ports.slice(0, 2), 4,2)
      expect((await getWhitelists(ports[0])).length).toEqual(4)
      expect((await getWhitelists(ports[1])).length).toEqual(4)
      expect((await getWhitelists(ports[2])).length).toEqual(1)
      expect((await getWhitelists(ports[3])).length).toEqual(1)
      await createFrom(ports.slice(2), 3)
      await waitForWhitelistSync(ports)
      expect((await getWhitelists(ports[0])).length).toEqual(4)
      expect((await getWhitelists(ports[1])).length).toEqual(4)
      expect((await getWhitelists(ports[2])).length).toEqual(4)
      expect((await getWhitelists(ports[3])).length).toEqual(4)
    })
  })
})



