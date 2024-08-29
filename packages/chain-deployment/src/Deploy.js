import {execSync} from 'child_process'
import {JsonRpcProvider} from 'ethers'
import fs from 'fs'
import {Deployment} from './Deployment.js'
import {loadJson} from './load-json.js'
import {Sourcer} from './Sourcer.js'
import {Verifier} from './Verifier.js'


export class Deploy {
  constructor(projectDir, config, options = {reset: false, skipVerify: true}) {
    if (options.network) config.network = options.network
    const {deployer, network, networks, contracts} = config
    this.contracts = contracts
    this.config = config
    this.sourcer = new Sourcer(projectDir, contracts, config)
    this.store = new DeploymentStore(config, options.reset)
    this.provider = options.provider || new JsonRpcProvider(networks[network].providerURL)
    this.deployment = new Deployment(this.provider, deployer.privateKey, options.skipVerify ? null : new Verifier(config))
  }

  async run() {
    console.log(`${'*'.repeat(30)} starting deploying contracts `.padEnd(120, '*'))
    console.log(`${'-'.repeat(60)} config `.padEnd(120, '-'))
    const {deployer, verifyApiKey, networks, owners_, ...secureConfig} = this.config
    console.log(JSON.stringify(secureConfig))
    console.log('-'.repeat(120))
    await this.sourcer.sourceContracts()
    await this.deployContracts()
    console.log(`${'*'.repeat(30)} finished deploying contracts `.padEnd(120, '*'))
  }

  async deployContracts() {
    const translateAddresses = (params = []) => params.map(_ => Array.isArray(_) ? translateAddresses(_) : this.store.get(_) || _)
    const translateLibraries = (names = []) => names.reduce((result, _) => Object.assign(result, ({[_]: this.store.get(_)})), {})

    console.log(`deploying contracts: [${Object.keys(this.contracts)}] `.padEnd(120, '.'))
    const block = await this.provider.getBlockNumber()
    this.store.establishBlock(block)
    for (let [name, {libraries, params}] of Object.entries(this.contracts)) {
      params = translateAddresses(params)
      libraries = translateLibraries(libraries)
      const json = this.sourcer.getJson(name)
      const sourcePath = this.sourcer.getSourcePath(name)
      const address = this.store.get(name)
      const contract = await this.deployment.getContract({name, json, sourcePath, address}, libraries, params)
      this.store.set(name, await contract.getAddress())
      this.store.save()
    }
  }
}


class DeploymentStore {
  constructor(config, reset = false) {
    this.config = config
    const envDir = `${config.deploymentDir}/env/${config.env}`
    execSync(`mkdir -p ${envDir}`)
    this.file = `${envDir}/.evms.json`
    this.load()
    for (const each of Object.values(this.contents)) each.contracts = each.contracts || {}
    if (reset) this.contents[this.network].contracts = {}
  }
  get network() { return this.config.network }
  get networks() { return this.config.networks }

  load() { this.contents = fs.existsSync(this.file) ? loadJson(this.file) : this.networks }
  save() { fs.writeFileSync(this.file, JSON.stringify(this.contents, null, 2)) }
  establishBlock(block) { if (!this.contents[this.network].block) this.contents[this.network].block = block }
  get contracts() { return this.contents[this.network].contracts }
  has(contract) { return !!this.contracts[contract] }
  get(contract) { return this.contracts[contract] }
  set(contract, address) { this.contracts[contract] = address }
}
