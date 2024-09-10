import {Deploy} from '@leverj/chain-deployment'
import {JsonStore, logger} from '@leverj/common'
import {exec} from 'child_process'
import {rmSync} from 'node:fs'
import waitOn from 'wait-on'
import config from '../config.js'
import {createDeployConfig, deploymentDir, hardhatConfigFileFor} from './help.js'
import {MultiChainVaultTracker} from './MultiChainVaultTracker.js'

const {chain: {polling}} = config

describe('MultiChainVaultTracker', () => {
  const deployedDir = `${deploymentDir}/env/${process.env.NODE_ENV}`
  const chains = ['hardhat', 'sepolia']
  const processes = []
  let coordinator

  before(async () => {
    rmSync(deployedDir, {recursive: true, force: true})
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
    const store = new JsonStore(deployedDir, '.evms')
    coordinator = MultiChainVaultTracker.of(chains, store, polling)
  })
  beforeEach(() => coordinator.start())
  afterEach(() => coordinator.stop())
  after(() => { while (processes.length > 0) processes.pop().kill() })

  it('load all chains from deployment', async () => {
  })
})
