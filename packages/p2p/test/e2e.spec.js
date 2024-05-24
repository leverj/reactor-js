import {setTimeout} from 'timers/promises'
import config from 'config'
import axios from 'axios'
import {expect} from 'expect'
import * as mcl from '../src/mcl/mcl.js'
import bls from '../src/bls.js'
import {getBootstrapNodes, getBridgeInfos} from './help/index.js'
import {tryAgainIfConnectionError, waitToSync} from '../src/utils.js'
import {connect, createApiNodes, createInfo_json, deleteInfoDir, killChildProcesses} from './help/e2e.js'

const message = 'hello world'
describe('e2e', function () {
  beforeEach(deleteInfoDir)
  afterEach(killChildProcesses)

  it('should create new nodes, connect and init DKG', async function () {
    const allNodes = await createApiNodes(2)
    await axios.post(`http://127.0.0.1:9000/api/dkg/start`)
    await setTimeout(1000)
    const publicKeys = await Promise.all(allNodes.map(async node => {
      const response = await axios.get(`http://127.0.0.1:${node}/api/dkg/publicKey`)
      return response.data.publicKey
    }))
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
      const {data: info} = await tryAgainIfConnectionError(() => axios.get(`http://127.0.0.1:${node}/api/info`))
      expect(info).toEqual(bridgeInfos[i])
    }
  })

  it('should create new nodes, load secret shares from local storage, sign message, and verify with individual pub key', async function () {
    const allNodes = [9000, 9001, 9002, 9003, 9004, 9005, 9006]
    await createInfo_json(allNodes.length)
    await createApiNodes(allNodes.length)
    // await connect(allNodes)
    for (const node of allNodes) {
      const apiResp = await axios.post(`http://127.0.0.1:${node}/api/tss/sign`, {'msg': message})
      const signature = new mcl.Signature()
      signature.deserializeHexStr(apiResp.data.signature)
      const individualPublicKey = mcl.deserializeHexStrToPublicKey(apiResp.data.signerPubKey)
      const verified = await individualPublicKey.verify(signature, message)
      expect(verified).toEqual(true)
    }
  })

  it('aggregate signatures over pubsub topic', async function () {
    const allNodes = [9000, 9001, 9002, 9003]
    await createInfo_json(allNodes.length)

    await createApiNodes(allNodes.length)
    // await connect(allNodes)
    const txnHash = 'hash123456'
    await axios.post('http://localhost:9000/api/tss/aggregateSign', {txnHash, 'msg': message})
    const fn = async () => {
      const {data: {verified}} = await axios.get('http://localhost:9000/api/tss/aggregateSign?txnHash=' + txnHash)
      return verified
    }
    await waitToSync([fn])
    const {data:{verified}} = await axios.get('http://localhost:9000/api/tss/aggregateSign?txnHash=' + txnHash)
    expect(verified).toEqual(true)
  })
})


