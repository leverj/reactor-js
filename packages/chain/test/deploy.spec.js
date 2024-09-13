import {Deploy} from '@leverj/chain-deployment'
import {logger} from '@leverj/common'
import {exec} from 'child_process'
import {isAddress} from 'ethers'
import {expect} from 'expect'
import {rmSync} from 'node:fs'
import {setTimeout} from 'node:timers/promises'
import waitOn from 'wait-on'
import config from '../config.js'

describe('deploy to hardhat chain', () => {
  const chain = 'hardhat'
  let evm

  before(async () => {
    expect(config.chains.includes(chain)).toBe(true)
    evm = exec(`npx hardhat node`)
    await waitOn({resources: [config.networks[chain].providerURL], timeout: 1000})
  })
  after(async () => {
    evm.kill()
    await setTimeout(200)
  })

  it('deploy', async () => {
    rmSync(`${config.deploymentDir}/env/test`, {recursive: true, force: true})
    const deploy = Deploy.from(config, logger)
    expect(deploy.config).toMatchObject(config)

    const pre_deployed = deploy.store.get(chain).contracts
    expect(pre_deployed.Vault).not.toBeDefined()

    await deploy.to(chain)
    const deployed = deploy.store.get(chain).contracts
    expect(deployed.Vault).toBeDefined()
    expect(isAddress(deployed.Vault.address)).toBe(true)
    expect(deployed.Vault.blockCreated).toBeGreaterThan(0n)
  })
})
