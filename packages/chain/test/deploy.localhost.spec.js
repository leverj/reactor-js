import {Deploy} from '@leverj/chain-deployment'
import {logger} from '@leverj/common'
import {exec} from 'child_process'
import {expect} from 'expect'
import {rmSync} from 'node:fs'
import waitOn from 'wait-on'
import config from '../config.js'

describe('deploy to localhost chain', () => {
  let localchain

  before(async () => {
    config.chain = 'localhost'
    rmSync(`${config.deploymentDir}/env/test`, {recursive: true, force: true})
    localchain = exec('npx hardhat node')
    await waitOn({resources: ['http://localhost:8545'], timeout: 1000})
  })
  after(() => localchain.kill())

  it('deploys all contracts', async () => {
    const deploy = Deploy.from(config, {logger})
    expect(deploy.config).toMatchObject(config)
    expect(await deploy.provider.getNetwork().then(_ => _.chainId)).toEqual(31337n)
    expect(deploy.deployedContracts.Vault).not.toBeDefined()

    await deploy.run()
    const deployed_initial = deploy.deployedContracts
    expect(deployed_initial.Vault).toBeDefined()

    {    // deploy again; do not reset contract addresses!
      const deploy = Deploy.from(config, {reset: false, logger})
      expect(deploy.deployedContracts.Vault).toBeDefined()

      await deploy.run()
      const redeployed_without_reset = deploy.deployedContracts
      expect(redeployed_without_reset).toMatchObject(deployed_initial)
    }
    {    // deploy again; force reset contract addresses!
      const deploy = Deploy.from(config, {reset: true, logger})
      expect(deploy.deployedContracts.Vault).not.toBeDefined()

      await deploy.run()
      const redeployed_with_reset = deploy.deployedContracts
      expect(redeployed_with_reset).not.toMatchObject(deployed_initial)
    }
  })
})
