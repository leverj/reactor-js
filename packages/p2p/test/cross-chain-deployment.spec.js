import 'dotenv/config'
import {Deploy} from '@leverj/chain-deployment'
import {logger} from '@leverj/common'
import {exec} from 'child_process'
import {expect} from 'expect'
import {rmSync} from 'node:fs'
import waitOn from 'wait-on'
import {createDeployConfig, deploymentDir} from './help.js'

describe('deploy across multiple chains', () => {
  const chains = ['hardhat', 'sepolia', 'mainnet']
  const processes = []

  before(async () => rmSync(`${deploymentDir}/env/${process.env.NODE_ENV}`, {recursive: true, force: true}))
  afterEach(async () => { while (processes.length > 0) processes.pop().kill() })

  it('deploys all contracts', async () => {
    for (let [i, chain] of chains.entries()) {
      const port = 8101 + i
      const config = createDeployConfig(chain, chains, {providerURL: `http://localhost:${port}`})
      const network = config.networks[chain]
      const hardhat_config = `test/hardhat/${network.testnet ? 'testnets' : 'mainnets'}/${chain}.config.cjs`
      processes.push(exec(`npx hardhat node --config ${hardhat_config} --port ${port}`))
      await waitOn({resources: [network.providerURL], timeout: 10_000})
      const deploy = Deploy.from(config, {logger})
      expect(await deploy.provider.getNetwork().then(_ => _.chainId)).toEqual(network.id)
      expect(deploy.deployedContracts.Vault).not.toBeDefined()

      await deploy.run()
      expect(deploy.deployedContracts.Vault).toBeDefined()
    }
  })
})
