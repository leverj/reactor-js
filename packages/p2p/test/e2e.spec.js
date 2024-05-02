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
    await rm('.e2e', {recursive: true})
  })

  it('should send FriendRequest as api call to bootstrap node', async function () {
    await createApiNodes(7)
    await setTimeout(5000)
    const bootstrapNodeUrl = config.bootstrap_nodes[0].url; //Assume single node for now
    let apiResp = await axios.get(`${bootstrapNodeUrl}/api/peer/info`)
    let whitelistedPeers = (apiResp.data.whitelistedPeers)
    console.log('whiteListed before', whitelistedPeers, Object.keys(whitelistedPeers).length)
    expect(Object.keys(whitelistedPeers).length).toEqual(0)
    await axios.post('http://127.0.0.1:9002/api/peer/sendFriendRequest') //eventually this will be called from the node's app.js bootstrap flow somewhere
    apiResp = await axios.get(`${bootstrapNodeUrl}/api/peer/info`)
    whitelistedPeers = Object.keys(apiResp.data.whitelistedPeers)
    console.log('whiteListed after', Object.keys(whitelistedPeers).length, whitelistedPeers)
    expect(Object.keys(whitelistedPeers).length).toEqual(1)
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
    PEER_CONF_DIR: './.e2e/' + index,
    PEER_PORT: config.bridge.port + index,
    PEER_IS_LEADER: isLeader
  }
  await mkdir(env.PEER_CONF_DIR, {recursive: true})
  return fork(`app.js`, [], {cwd: __dirname, env})
}