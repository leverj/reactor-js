import {Deploy, provider} from '@leverj/chain-deployment'
import {logger} from '@leverj/common'
import {expect} from 'expect'
import {rmSync} from 'node:fs'
import {createConfig} from './help.js'

describe.skip('deploy to hardhat chain', () => {
  const chains = ['hardhat', 'sepolia', 'holesky']
  const config = createConfig(chains)
  before(() => rmSync(`${config.deploymentDir}/env/${process.env.NODE_ENV}`, {recursive: true, force: true}))

  it('deploys all contracts', async () => {
    const deploy = Deploy.from(config, {provider, logger})
    expect(deploy.config).toMatchObject(config)
    expect(await deploy.provider.getNetwork().then(_ => _.name)).toEqual('hardhat')
    expect(await deploy.provider.getNetwork().then(_ => _.chainId)).toEqual(31337n)
    expect(deploy.deployedContracts.Vault).not.toBeDefined()

    await deploy.to(chain) //fixme
    const deployed_initial = deploy.deployedContracts
    expect(deployed_initial.Vault).toBeDefined()

    {    // deploy again; do not reset contract addresses!
      const deploy = Deploy.from(config, {reset: false, provider, logger})
      expect(deploy.deployedContracts.Vault).toBeDefined()

      await deploy.run()
      const redeployed_without_reset = deploy.deployedContracts
      expect(redeployed_without_reset).toMatchObject(deployed_initial)
    }
    {    // deploy again; force reset contract addresses!
      const deploy = Deploy.from(config, {reset: true, provider, logger})
      expect(deploy.deployedContracts.Vault).not.toBeDefined()

      await deploy.run()
      const redeployed_with_reset = deploy.deployedContracts
      expect(redeployed_with_reset).not.toMatchObject(deployed_initial)
    }
  })
})
