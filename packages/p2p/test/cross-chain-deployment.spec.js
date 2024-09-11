import 'dotenv/config'
import {Deploy} from '@leverj/chain-deployment'
import {logger} from '@leverj/common'
import {exec} from 'child_process'
import {expect} from 'expect'
import {rmSync} from 'node:fs'
import waitOn from 'wait-on'
import {Chain, createDeployConfig, deploymentDir, hardhatConfigFileFor} from './help.js'

describe('deploy across multiple chains', () => {
  const chains = ['hardhat', 'sepolia', 'mainnet']
  const processes = []

  before(async () => {
    const deployedDir = `${deploymentDir}/env/${process.env.NODE_ENV}`
    rmSync(deployedDir, {recursive: true, force: true})
  })
  afterEach(async () => { while (processes.length > 0) processes.pop().kill() })

  it('deploys all contracts', async () => {
    for (let [i, chain] of chains.entries()) {
      const port = 8101 + i
      const config = createDeployConfig(chain, chains, {providerURL: `http://localhost:${port}`})
      const network = config.networks[chain]
      processes.push(exec(`npx hardhat node --config ${hardhatConfigFileFor(config)} --port ${port}`))
      await waitOn({resources: [network.providerURL], timeout: 10_000})
      const deploy = Deploy.from(config, {logger})
      expect(deploy.deployedContracts.Vault).not.toBeDefined()
      expect((await Chain.from(deploy.provider)).id).toEqual(network.id)
      expect((await Chain.from(deploy.provider)).label).toEqual(network.label)

      await deploy.run()
      expect(deploy.deployedContracts.Vault).toBeDefined()
    }
  })
})
