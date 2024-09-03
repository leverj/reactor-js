import {execSync} from 'child_process'
import {JsonRpcProvider} from 'ethers'
import {writeFileSync} from 'node:fs'
import {Deployment} from './Deployment.js'
import {Sourcer} from './Sourcer.js'
import {Verifier} from './Verifier.js'

export class Deploy {
  static async from(projectDir, config, options = {reset: false, skipVerify: true, logger: console}) {
    const logger = options.logger || console
    if (options.network) config.network = options.network
    const {contracts, deployer, network, networks} = config
    const sourcer = new Sourcer(projectDir, contracts, config, logger)
    const store = await DeploymentStore.from(config, network, options.reset)
    const provider = options.provider || new JsonRpcProvider(networks[network].providerURL)
    const verifier = options.skipVerify ? null : new Verifier(config, logger)
    const deployment = new Deployment(provider, deployer.privateKey, verifier, logger)
    return new this(config, sourcer, store, deployment, provider, logger)
  }

  constructor(config, sourcer, store, deployment, provider, logger) {
    this.config = config
    this.sourcer = sourcer
    this.store = store
    this.deployment = deployment
    this.provider = provider
    this.logger = logger
  }
  get contracts() { return this.config.contracts }

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
    const translateAddresses = (params = []) => params.map(_ => Array.isArray(_) ? translateAddresses(_) : this.store.get(_) || _)
    const translateLibraries = (names = []) => names.reduce((result, _) => Object.assign(result, ({[_]: this.store.get(_)})), {})

    this.logger.log(`deploying contracts: [${Object.keys(this.contracts)}] `.padEnd(120, '.'))
    const block = await this.provider.getBlockNumber()
    this.store.establishBlock(block)
    for (let [name, {libraries, params}] of Object.entries(this.contracts)) {
      params = translateAddresses(params)
      libraries = translateLibraries(libraries)
      const json = await this.sourcer.getJson(name)
      const sourcePath = this.sourcer.getSourcePath(name)
      const address = this.store.get(name)
      const contract = await this.deployment.getContract({name, json, sourcePath, address}, libraries, params)
      this.store.set(name, await contract.getAddress())
      this.store.save()
    }
  }
}

class DeploymentStore {
  static async from(config, network, reset = false) {
    const {env, deploymentDir, networks} = config
    const envDir = `${deploymentDir}/env/${env}`
    execSync(`mkdir -p ${envDir}`)
    const file = `${envDir}/.evms.json`
    const contents = await import(file, {assert: {type: 'json'}}).then(_ => _.default).catch(e => networks)
    for (const each of Object.values(contents)) each.contracts = each.contracts || {}
    if (reset) contents[network].contracts = {}
    return new this(network, file, contents)
  }

  constructor(network, file, contents) {
    this.network = network
    this.file = file
    this.contents = contents
  }

  save() { writeFileSync(this.file, JSON.stringify(this.contents, null, 2)) }
  establishBlock(block) { if (!this.contents[this.network].block) this.contents[this.network].block = block }
  get contracts() { return this.contents[this.network].contracts }
  has(contract) { return !!this.contracts[contract] }
  get(contract) { return this.contracts[contract] }
  set(contract, address) { this.contracts[contract] = address }
}
