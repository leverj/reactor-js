import {fork} from 'child_process'
import {setTimeout} from 'timers/promises'
import config from 'config'
import axios from 'axios'
import {mkdir, rm} from 'node:fs/promises'
import {expect} from 'expect'

const __dirname = process.cwd()
console.log('dirname', __dirname)
describe('e2e', function () {
  beforeEach(async function () {
  })
  afterEach(async function () {
    for (const childProcess of childProcesses) childProcess.kill()
    //await rm('.e2e', {recursive: true})
  })

  //add new nodes to peer list and sync up all nodes with updated peer list
  it('should send JoinBridgeRequest as api call to bootstrap node', async function () {
    const allNodes = [9000, 9001, 9002, 9003, 9004, 9005, 9006]
    await createApiNodes(allNodes.length)
    await setTimeout(5000)
    const bootstrapNodeUrl = config.bridgeNode.bootstrapNode; 
    let apiResp = await axios.get(`${bootstrapNodeUrl}/api/peer/info`)
    let whitelistedPeers = (apiResp.data.whitelistedPeers)
    //const newJoinees = [9001]
    for (const node of allNodes){
      apiResp = await axios.get(`http://127.0.0.1:${node}/api/peer/info`)
      whitelistedPeers = Object.keys(apiResp.data.whitelistedPeers)
      expect(Object.keys(whitelistedPeers).length).toEqual(0)
    }
    for (const newJoinee of allNodes){
      await axios.post(`http://127.0.0.1:${newJoinee}/api/peer/joinBridgeRequest`) 
      console.log("Node Added to Bridge via Api")
    }
    for (const node of allNodes){
      apiResp = await axios.get(`http://127.0.0.1:${node}/api/peer/info`)
      whitelistedPeers = Object.keys(apiResp.data.whitelistedPeers)
      console.log(`whiteList in peer ${node}`, Object.keys(whitelistedPeers).length, JSON.stringify(whitelistedPeers))
      expect(Object.keys(whitelistedPeers).length).toEqual(allNodes.length)
    }
    await setTimeout(1000)
  }).timeout(-1)
  it('should send JoinBridgeRequest, connect and init DKG', async function () {
    const allNodes = [9000, 9001, 9002, 9003, 9004, 9005, 9006]
    await createApiNodes(allNodes.length)
    await setTimeout(5000)
    const bootstrapNodeUrl = config.bridgeNode.bootstrapNode; 
    let apiResp = await axios.get(`${bootstrapNodeUrl}/api/peer/info`)
    let whitelistedPeers = (apiResp.data.whitelistedPeers)
    //const newJoinees = [9001]
    for (const node of allNodes){
      apiResp = await axios.get(`http://127.0.0.1:${node}/api/peer/info`)
      whitelistedPeers = Object.keys(apiResp.data.whitelistedPeers)
      expect(Object.keys(whitelistedPeers).length).toEqual(0)
    }
    for (const newJoinee of allNodes){
      await axios.post(`http://127.0.0.1:${newJoinee}/api/peer/joinBridgeRequest`) 
      console.log("Node Added to Bridge via Api")
    }
    for (const node of allNodes){
      await axios.post(`http://127.0.0.1:${node}/api/peer/connect`)
      await setTimeout(1000)
      apiResp = await axios.get(`http://127.0.0.1:${node}/api/peer/info`)
      expect(apiResp.data.p2p.peers.length).toEqual(allNodes.length - 1)
    }
    await axios.post(`${bootstrapNodeUrl}/api/dkg/start`)
    let groupPublicKey, prevGroupPublicKey;
    for (const node of allNodes){
      apiResp = await axios.get(`http://127.0.0.1:${node}/api/peer/info`)
      prevGroupPublicKey = groupPublicKey
      console.log(apiResp.data.tssNode) //FIXME. WEIRD - commenting this console.log causes TC to fail some times
      groupPublicKey = apiResp.data.tssNode.groupPublicKey
      //Group public key of each node must be same, compare consecutive for all
      if (prevGroupPublicKey && groupPublicKey) expect(prevGroupPublicKey).toEqual(groupPublicKey)
    }
    await setTimeout(1000)
  }).timeout(-1)
})

const childProcesses = []

async function createApiNodes(count) {
  for (let i = 0; i < count; i++)
    childProcesses.push(await createApiNode({index: i, isLeader: i === 0}))
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