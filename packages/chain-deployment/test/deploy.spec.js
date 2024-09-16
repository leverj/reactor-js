import info from '../package.json' assert {type: 'json'}
import {Deploy, networks} from '@leverj/chain-deployment'
import {logger} from '@leverj/common'
import {isAddress} from 'ethers'
import {expect} from 'expect'
import {Map} from 'immutable'
import {cloneDeep, zip} from 'lodash-es'
import {exec} from 'node:child_process'
import {rmSync} from 'node:fs'
import {setTimeout} from 'node:timers/promises'
import waitOn from 'wait-on'
import config from '../config.js'

describe('deploy to multiple chains', () => {
  const chains = ['holesky', 'sepolia']
  let processes

  before(async () => {
    const {ports, providerURLs} = configureDeployment()
    processes = await launchEvms(ports, providerURLs)
  })

  after(async () => {
    for (let each of processes) {
      each.kill()
      while(!each.killed) await setTimeout(10)
    }
  })

  const configureDeployment = () => {
    config.contracts = Map(zip(
      chains,
      chains.map(_ => ({Bank: {params: [networks[_].id, info.name]}}))
    )).toJS()
    const ports = chains.map((chain, i) => 8101 + i)
    const providerURLs = ports.map(port => `http://localhost:${port}`)
    zip(chains, providerURLs).forEach(([chain, providerURL]) => config.networks[chain].providerURL = providerURL)
    return {ports, providerURLs}
  }

  const launchEvms = async (ports, providerURLs) => {
    const processes = []
    for (let [chain, port, providerURL] of zip(chains, ports, providerURLs)) {
      const evm = exec(`npx hardhat node --config ${import.meta.dirname}/hardhat/${chain}.config.cjs --port ${port}`)
      await waitOn({resources: [providerURL], timeout: 10_000})
      processes.push(evm)
    }
    return processes
  }

  it('can deploy contracts to each chain', async () => {
    rmSync(`${config.deploymentDir}/env/test`, {recursive: true, force: true})
    const deploy = Deploy.from(config, logger)

    for (let chain of chains) {
      const pre_deployed = deploy.store.get(chain).contracts
      expect(pre_deployed.Bank).not.toBeDefined()

      // first deploy; from scratch
      await deploy.to(chain)
      const deployed_initial = cloneDeep(deploy.store.get(chain).contracts)
      expect(deployed_initial.Bank).toBeDefined()
      expect(isAddress(deployed_initial.Bank.address)).toBe(true)

      // deploy again, but not really; do not reset contract addresses!
      await deploy.to(chain, {reset: false})
      const redeployed_without_reset = cloneDeep(deploy.store.get(chain).contracts)
      expect(redeployed_without_reset.Bank).toMatchObject(deployed_initial.Bank)

      // redeploy again; force reset contract addresses!
      await deploy.to(chain, {reset: true})
      const redeployed_with_reset = cloneDeep(deploy.store.get(chain).contracts)
      expect(redeployed_with_reset.Bank).not.toMatchObject(deployed_initial.Bank)
    }
  })
})
