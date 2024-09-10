import {Deploy} from '@leverj/chain-deployment'
import {JsonStore, logger} from '@leverj/common'
import {exec} from 'child_process'
import {expect} from 'expect'
import {rmSync} from 'node:fs'
import waitOn from 'wait-on'
import {CrossChainVaultsTracker} from '../src/CrossChainVaultsTracker.js'
import config from '../config.js'
import {createDeployConfig, deploymentDir, hardhatConfigFileFor} from './help.js'

const {bridge: {confDir}, chain: {polling}} = config

describe('CrossChainVaultsTracker', () => {
  const deployedDir = `${deploymentDir}/env/${process.env.NODE_ENV}`
  const chains = ['hardhat', 'sepolia']
  const processes = []
  let tracker

  before(async () => {
    rmSync(deployedDir, {recursive: true, force: true})
    rmSync(confDir, {recursive: true, force: true})
    const store = new JsonStore(confDir, 'trackers')
    const configs = []
    for (let [i, chain] of chains.entries()) {
      const port = 8101 + i
      const config = createDeployConfig(chain, chains, {providerURL: `http://localhost:${port}`})
      processes.push(exec(`npx hardhat node --config ${hardhatConfigFileFor(config)} --port ${port}`))
      configs.push(config)
    }
    for (let config of configs) {
      await waitOn({resources: [config.networks[config.chain].providerURL], timeout: 10_000})
      await Deploy.from(config, {logger}).run()
    }
    const evms = new JsonStore(deployedDir, '.evms').toObject()
    tracker = CrossChainVaultsTracker.of(chains, evms, store, polling)
  })
  after(() => { while (processes.length > 0) processes.pop().kill() })

  it('can start & stop', async () => {
    expect(tracker.chains).toEqual(chains)
    expect(tracker.isRunning).toBe(false)

    await tracker.start()
    expect(tracker.isRunning).toBe(true)

    tracker.stop()
    expect(tracker.isRunning).toBe(false)
  })
})
