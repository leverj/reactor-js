import {fork} from 'child_process'
import {setTimeout} from 'timers/promises'
import config from 'config'
import axios from 'axios'
import {mkdir, rm} from 'node:fs/promises'

const __dirname = process.cwd()
console.log('dirname', __dirname)
describe('e2e', function () {
  beforeEach(async function () {
  })
  afterEach(async function () {
    for (const childProcess of childProcesses) childProcess.kill()
    await rm('.e2e', {recursive: true})
  })

  it('should work from app.js', async function () {
    await createNodes(7)
    await setTimeout(5000)
  }).timeout(-1)
})

const childProcesses = []

async function createNodes(count) {
  for (let i = 0; i < count; i++)
    childProcesses.push(await createNode({index: i, isLeader: i === 0}))
  return childProcesses
}

async function createNode({index, isLeader = false}) {
  const env = {
    PORT: 9000 + index,
    PEER_CONF_DIR: './.e2e/' + index,
    PEER_PORT: config.bridge.port + index,
    IS_LEADER: isLeader
  }
  await mkdir(env.PEER_CONF_DIR, {recursive: true})
  return fork(`app.js`, [], {cwd: __dirname, env})
}