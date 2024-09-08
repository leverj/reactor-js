import {JsonStore} from '@leverj/common'
import {execSync} from 'child_process'
import {JsonRpcProvider, Wallet} from 'ethers'
import {default as hardhat} from 'hardhat'
import {Map} from 'immutable'
import {setTimeout} from 'node:timers/promises'

export class Deploy {
  static from(config, options = {reset: false, logger: console}) {
    const logger = options.logger || console
    const {chain, networks} = config
    const provider = options.provider || new JsonRpcProvider(networks[chain].providerURL)
    const store = this.getStore(config, options.reset)
    return new this(config, provider, store, logger)
  }

  static getStore(config, reset) {
    const {deploymentDir, env, chain, networks} = config
    const store = new JsonStore(`${deploymentDir}/env/${env}`, '.evms')
    if (!store.exists) Map(networks).forEach((value, key) => store.set(key, value))
    if (reset) {
      const contracts = store.get(chain).contracts
      Object.keys(contracts).forEach(_ => delete contracts[_])
      store.save()
    }
    return store
  }

  constructor(config, provider, store, logger) {
    this.config = config
    this.provider = provider
    this.store = store
    this.logger = logger
    this.wallet = new Wallet(config.deployer.privateKey, provider)
  }
  get chain() { return this.config.chain }
  get contracts() { return this.config.contracts[this.chain] }
  get deployedContracts() { return this.store.get(this.chain).contracts }

  async run() {
    this.logger.log(`${'*'.repeat(30)} starting deploying contracts `.padEnd(120, '*'))
    this.logger.log(`${'-'.repeat(60)} config `.padEnd(120, '-'))
    const {deployer, vault, networks, contracts, deploymentDir, ...secureConfig} = this.config
    this.logger.log(secureConfig)
    this.logger.log('-'.repeat(120))
    this.compileContracts()
    await this.deployContracts()
    this.logger.log(`${'*'.repeat(30)} finished deploying contracts `.padEnd(120, '*'))
  }

  compileContracts() {
    this.logger.log(`compiling contracts `.padEnd(120, '.'))
    execSync(`npx hardhat compile --quiet --config ${process.env.PWD}/hardhat.config.cjs`)
  }

  async deployContracts() {
    const getContractAddress = (name) => this.deployedContracts[name]?.address
    const translateAddresses = (params = []) => params.map(_ => Array.isArray(_) ? translateAddresses(_) : getContractAddress(_) || _)
    const translateLibraries = (names = []) => names.reduce((result, _) => Object.assign(result, ({[_]: getContractAddress(_)})), {})

    this.logger.log(`deploying contracts: [${Object.keys(this.contracts)}] `.padEnd(120, '.'))
    if (!this.store.get(this.chain).block) { // establish start block // fixme: is it ever used?
      this.store.update(this.chain, {block: await this.provider.getBlockNumber()})
    }
    for (let [name, {libraries, params}] of Object.entries(this.contracts)) {
      if (this.deployedContracts[name]) continue

      this.logger.log(`deploying ${name} contract `.padEnd(120, '.'))
      libraries = translateLibraries(libraries)
      params = translateAddresses(params)
      const contract = await hardhat.ethers.deployContract(name, params, {libraries, signer: this.wallet})
      const address = contract.target
      const blockCreated = await this.provider.getTransactionReceipt(contract.deploymentTransaction().hash).then(_ => _.blockNumber)
      this.store.update(this.chain, {contracts: {[name]: {address, blockCreated}}})
      await setTimeout(200) // note: must wait a bit to avoid "Nonce too low" error
    }
  }
}
