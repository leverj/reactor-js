import {JsonStore} from '@leverj/common'
import {JsonRpcProvider} from 'ethers'
import {Map} from 'immutable'
import {Deployment} from './Deployment.js'
import {Sourcer} from './Sourcer.js'
import {Verifier} from './Verifier.js'

export class Deploy {
  static from(projectDir, config, options = {reset: false, skipVerify: true, logger: console}) {
    const logger = options.logger || console
    if (options.network) config.network = options.network
    const {contracts, deployer, network, networks} = config
    const provider = options.provider || new JsonRpcProvider(networks[network].providerURL)
    const store = this.getStore(config, options.reset)
    const sourcer = new Sourcer(projectDir, contracts, config, logger)
    const verifier = options.skipVerify ? null : new Verifier(config, logger)
    const deployment = new Deployment(provider, deployer.privateKey, verifier, logger)
    return new this(config, provider, store, sourcer, deployment, logger)
  }

  static getStore(config, reset) {
    const {deploymentDir, env, network, networks} = config
    const store = new JsonStore(`${deploymentDir}/env/${env}`, '.evms')
    if (!store.exists) Map(networks).forEach((value, key) => store.set(key, value))
    if (reset) {
      const contracts = store.get(network).contracts
      Object.keys(config.contracts).forEach(_ => delete contracts[_])
      store.save()
    }
    return store
  }

  constructor(config, provider, store, sourcer, deployment, logger) {
    this.config = config
    this.provider = provider
    this.store = store
    this.sourcer = sourcer
    this.deployment = deployment
    this.logger = logger
  }
  get network() { return this.config.network }
  get contracts() { return this.store.get(this.network).contracts }

  async run() {
    this.logger.log(`${'*'.repeat(30)} starting deploying contracts `.padEnd(120, '*'))
    this.logger.log(`${'-'.repeat(60)} config `.padEnd(120, '-'))
    const {deployer, verifyApiKey, networks, owners_, ...secureConfig} = this.config
    this.logger.log(JSON.stringify(secureConfig))
    this.logger.log('-'.repeat(120))
    await this.sourcer.sourceContracts()
    await this.deployContracts()
    this.logger.log(`${'*'.repeat(30)} finished deploying contracts `.padEnd(120, '*'))
  }

  async deployContracts() {
    const getContractAddress = (name) => this.contracts[name]?.address
    const translateAddresses = (params = []) => params.map(_ => Array.isArray(_) ? translateAddresses(_) : getContractAddress(_) || _)
    const translateLibraries = (names = []) => names.reduce((result, _) => Object.assign(result, ({[_]: getContractAddress(_)})), {})

    this.logger.log(`deploying contracts: [${Object.keys(this.config.contracts)}] `.padEnd(120, '.'))
    if (!this.store.get(this.network).block) { // establish start block
      this.store.update(this.network, {block: await this.provider.getBlockNumber()})
    }
    for (let [name, {libraries, params}] of Object.entries(this.config.contracts)) {
      if (!this.contracts[name]) {
        const {address, blockCreated} = await this.deployment.getContract(
          await this.sourcer.getJson(name),
          this.sourcer.getSourcePath(name),
          translateLibraries(libraries),
          translateAddresses(params)
        )
        this.store.update(this.network, {contracts: {[name]: {address, blockCreated}}})
      }
    }
  }
}
