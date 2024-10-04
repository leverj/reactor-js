import {Deploy} from '@leverj/chain-deployment'
import {JsonStore, logger} from '@leverj/common'
import {configure} from '@leverj/config'
import * as reactor_chain_config from '@leverj/reactor.chain/config.schema'
import {JsonRpcProvider} from 'ethers'
import {Map} from 'immutable'
import {merge, zip} from 'lodash-es'
import {exec} from 'node:child_process'
import {rmSync, writeFileSync} from 'node:fs'
import {inspect} from 'util'
import waitOn from 'wait-on'
import {killAll} from './processes.js'

const createChainConfig = async (chains, vault) => {
  const postLoad = (config) => {
    config = reactor_chain_config.postLoad(config)
    merge(config.contracts, Map(config.networks).map(({id, label}) => ({
      ERC20Mock: {
        params: [`Gold-${label}`, `💰-${id}`],
      },
    })).toJS())
    return config
  }

  // override chain/config/env with ^^^ chains
  const env = process.env.NODE_ENV
  const chain_dir = `${import.meta.dirname}/../../../../chain`
  const override_file = `${chain_dir}/config/local-${env}.js`
  writeFileSync(override_file, `export default ${inspect({chains, vault}, {showHidden: false, compact: false})}`)
  const config = await configure(reactor_chain_config.schema, postLoad, {env: {PWD: chain_dir, NODE_ENV: env}})
  rmSync(override_file)
  return config
}

export class Evms {
  static async with(chains, vault = {}) {
    const config = await createChainConfig(chains, vault)
    return new this(config)
  }

  constructor(config) {
    this.config = config
    this.deploymentDir = `${config.deploymentDir}/${config.env}`
    this.processes = []
  }
  get chains() { return this.config.chains }
  get networks() { return this.config.networks }
  get deployed() { return new JsonStore(this.deploymentDir, '.evms').toObject() }

  async start() {
    rmSync(this.deploymentDir, {recursive: true, force: true})
    this.processes = await this.launchAll()
    return this
  }

  async stop() {
    await killAll(this.processes)
    this.processes.length = 0
  }

  async launchAll(forked = false) {
    const launch = (chain, port) => {
      const dir = `${import.meta.dirname}/hardhat/${forked ? 'forked' : 'nascent'}/${this.networks[chain].testnet ? 'testnets' : 'mainnets'}`
      const process = exec(`npx hardhat node --config ${dir}/${chain}.config.cjs --port ${port}`)
      process.stdout.on('data', logger.log)
      return process
    }

    const ports = this.chains.map((chain, i) => 8101 + i)
    const providerURLs = ports.map(port => `http://localhost:${port}`)
    zip(this.chains, providerURLs).forEach(([chain, providerURL]) => this.networks[chain].providerURL = providerURL)
    const processes = zip(this.chains, ports).map(([chain, port]) => launch(chain, port))
    const deploy = Deploy.from(this.config, logger)
    for (let [chain, providerURL] of zip(this.chains, providerURLs)) {
      await waitOn({resources: [providerURL], timeout: 10_000})
      await deploy.to(chain, {reset: true})
    }
    return processes
  }

  getDeployments() {
    return Map(this.deployed).map(_ => ({
      id: BigInt(_.id),
      label: _.label,
      nativeCurrency: _.nativeCurrency,
      providerURL: _.providerURL,
      provider: new JsonRpcProvider(_.providerURL),
      Vault: _.contracts.Vault,
    })).valueSeq().toArray()
  }
}
