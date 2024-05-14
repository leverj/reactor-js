import {setTimeout} from 'timers/promises'
import config from 'config'
import axios from 'axios'
import {expect} from 'expect'
import * as mcl from '../src/mcl/mcl.js'
import bls from '../src/bls.js'
import {getBridgeInfos} from './help/index.js'
import {tryAgainIfConnectionError} from '../src/utils.js'
import {connect, createApiNodes, createInfo_json, deleteInfoDir, killChildProcesses} from './help/e2e.js'

const message = 'hello world'
describe('e2e', function () {
  beforeEach(deleteInfoDir)
  afterEach(killChildProcesses)

  it('should create new nodes, connect and init DKG', async function () {
    const allNodes = [9000, 9001, 9002, 9003, 9004, 9005, 9006]
    await createApiNodes(allNodes.length)
    const bootstrapNodeUrl = config.bridgeNode.bootstrapNode
    await connect(allNodes)
    await axios.post(`${bootstrapNodeUrl}/api/dkg/start`)
    await setTimeout(1000)
    const publicKeys = await Promise.all(allNodes.map(async node => {
      const response = await axios.get(`http://127.0.0.1:${node}/api/dkg/publicKey`)
      return response.data.publicKey
    }))
    for (const publicKey of publicKeys) {
      expect(publicKey).not.toBeNull()
      expect(publicKey).toEqual(publicKeys[0])
    }
  }).timeout(-1)

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
  }).timeout(-1)

  it('should create new nodes, load secret shares from local storage, sign message, and verify with individual pub key', async function () {
    const allNodes = [9000, 9001, 9002, 9003, 9004, 9005, 9006]
    await createInfo_json(allNodes.length)
    await createApiNodes(allNodes.length)
    await connect(allNodes)
    for (const node of allNodes) {
      const apiResp = await axios.post(`http://127.0.0.1:${node}/api/tss/sign`, {'msg': message})
      const signature = new mcl.Signature()
      signature.deserializeHexStr(apiResp.data.signature)
      const individualPublicKey = mcl.deserializeHexStrToPublicKey(apiResp.data.signerPubKey)
      const verified = await individualPublicKey.verify(signature, message)
      expect(verified).toEqual(true)
    }
  }).timeout(-1)
  it('aggregate signatures', async function () {
    const allNodes = [9000, 9001, 9002, 9003]
    await createInfo_json(allNodes.length)
    await createApiNodes(allNodes.length)
    const {data: {publicKey}} = await axios.get(`http://127.0.0.1:${allNodes[0]}/api/dkg/publicKey`)
    const groupPublicKey = mcl.deserializeHexStrToPublicKey(publicKey)
    const aggregateSignature = new bls.Signature()
    const signs = [], signers = []
    for (const node of allNodes) {
      const apiResp = await axios.post(`http://127.0.0.1:${node}/api/tss/sign`, {'msg': message})
      const signature = new mcl.Signature()
      const signer = new bls.SecretKey()
      signer.deserializeHexStr(apiResp.data.signer)
      signature.deserializeHexStr(apiResp.data.signature)
      signs.push(signature)
      signers.push(signer)
    }
    aggregateSignature.recover(signs, signers)
    const verified = await groupPublicKey.verify(aggregateSignature, message)
    expect(verified).toEqual(true)
  }).timeout(-1)
  it('aggregate signatures over pubsub topic', async function () {
    const allNodes = [9000, 9001, 9002, 9003]
    await createInfo_json(allNodes.length)
    await createApiNodes(allNodes.length)
    await setTimeout(1000)
    //txnHash is assumed to be unique so the leader node can accumulate share signs against it
    await axios.post('http://localhost:9000/api/tss/aggregateSign', {'txnHash': 'hash123456','msg': message})
    await setTimeout(1000)
  }).timeout(-1)
})


