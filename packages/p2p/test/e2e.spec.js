import {fork} from 'child_process'
import {setTimeout} from 'timers/promises'
import config from 'config'
import axios from 'axios'
import {writeFile, mkdir, rm} from 'node:fs/promises'
import {expect} from 'expect'
import * as mcl from '../src/mcl/mcl.js'
import bls from '../src/bls.js'
import {getBridgeInfos} from './help/index.js'
import path from 'path'

const message = 'hello world'
const __dirname = process.cwd()
console.log('dirname', __dirname)
describe('e2e', function () {
  beforeEach(async function () {
    await rm('.e2e', {recursive: true, force: true})
  })
  afterEach(async function () {
    for (const childProcess of childProcesses) childProcess.kill()
    //await rm('.e2e', {recursive: true})
  })

  it('should create new nodes, connect and init DKG', async function () {
    const allNodes = [9000, 9001, 9002, 9003, 9004, 9005, 9006]
    await createApiNodes(allNodes.length)
    await setTimeout(5000)
    const bootstrapNodeUrl = config.bridgeNode.bootstrapNode
    for (const node of allNodes) {
      await axios.post(`http://127.0.0.1:${node}/api/peer/connect`)
      await setTimeout(1000)
      const {data: peers} = await axios.get(`http://127.0.0.1:${node}/api/peer`)
      expect(peers.length).toEqual(allNodes.length - 1)
    }
    await axios.post(`${bootstrapNodeUrl}/api/dkg/start`)
    await setTimeout(1000)
    const publicKeys = await Promise.all(allNodes.map(async node => {
      console.log('#'.repeat(50), 'url', `http://127.0.0.1:${node}/api/dkg/publicKey`)
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
      const {data: info} = await axios.get(`http://127.0.0.1:${node}/api/info`)
      expect(info).toEqual(bridgeInfos[i])
    }
  }).timeout(-1)

  it('should create new nodes, load secret shares from local storage, sign message, and verify with individual pub key', async function () {
    const allNodes = [9000, 9001, 9002, 9003, 9004, 9005, 9006]
    await createInfo_json(allNodes.length)

    await createApiNodes(allNodes.length)
    for (const node of allNodes) {
      await axios.post(`http://127.0.0.1:${node}/api/peer/connect`)
      await setTimeout(1000)
      const {data: peers} = await axios.get(`http://127.0.0.1:${node}/api/peer`)
      expect(peers.length).toEqual(allNodes.length - 1)
    }
    for (const node of allNodes) {
      const apiResp = await axios.post(`http://127.0.0.1:${node}/api/tss/sign`, {'msg': message})
      const signature = new mcl.Signature()
      signature.deserializeHexStr(apiResp.data.signature)
      const individualPublicKey = mcl.deserializeHexStrToPublicKey(apiResp.data.signerPubKey)
      const verified = await individualPublicKey.verify(signature, message)
      expect(verified).toEqual(true)
    }
    await setTimeout(1000)
  }).timeout(-1)
  it('should create new nodes, load secret shares from local storage, and aggregate signatures', async function () {
    const allNodes = [9000, 9001, 9002, 9003]
    await createApiNodes(allNodes.length)
    const bootstrapNodeUrl = config.bridgeNode.bootstrapNode
    // let apiResp = await axios.get(`${bootstrapNodeUrl}/api/peer/info`)
    for (const node of allNodes) {
      await axios.post(`http://127.0.0.1:${node}/api/peer/connect`)
      await setTimeout(1000)
      const {data: peers} = await axios.get(`http://127.0.0.1:${node}/api/peer`)
      expect(peers.length).toEqual(allNodes.length - 1)
    }
    await axios.post(`${bootstrapNodeUrl}/api/dkg/start`)
    await setTimeout(1000)
    for (const childProcess of childProcesses) childProcess.kill()
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
    console.log('verified', verified)

    await setTimeout(1000)
  }).timeout(-1)
})

const childProcesses = []

async function createApiNodes(count) {
  for (let i = 0; i < count; i++) {
    childProcesses.push(await createApiNode({index: i, isLeader: i === 0}))
    await setTimeout(2000)
  }
  return childProcesses
}

async function createApiNode({index, isLeader = false}) {
  const env = {
    PORT: 9000 + index,
    BRIDGE_CONF_DIR: './.e2e/' + index,
    BRIDGE_PORT: config.bridgeNode.port + index,
    BRIDGE_IS_LEADER: isLeader
  }
  await mkdir(env.BRIDGE_CONF_DIR, {recursive: true})
  return fork(`app.js`, [], {cwd: __dirname, env})
}

async function createInfo_json(count) {
  const bridgeInfos = getBridgeInfos(count)
  for (let i = 0; i < count; i++) {
    const info = bridgeInfos[i]
    let dir = path.join(__dirname, '.e2e', i.toString())
    await mkdir(dir, {recursive: true})
    await writeFile(path.join(dir, 'info.json'), JSON.stringify(info, null, 2))
  }
}