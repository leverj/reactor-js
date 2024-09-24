import {JsonStore} from '@leverj/common'
import {default as hardhat} from 'hardhat'
import {Map} from 'immutable'
import {execSync} from 'node:child_process'
import {setTimeout} from 'node:timers/promises'

export const {ethers: {deployContract, JsonRpcProvider, Wallet}} = hardhat

export class Deploy {
  static from(config, logger = console) {
    const store = this.getStore(config)
    return new this(config, store, logger)
  }

  static getStore(config) {
    const {deploymentDir, env, networks} = config
    const store = new JsonStore(`${deploymentDir}/${env}`, '.evms')
    if (!store.exists) Map(networks).forEach((value, key) => store.set(key, value))
    return store
  }

  constructor(config, store, logger) {
    this.config = config
    this.store = store
    this.logger = logger
  }

  async to(chain, options = {}) {
    const providerURL = this.config.networks[chain]?.providerURL
    if (!providerURL) throw Error(`chain ${chain} is not supported`)

    this.logger.log(`${'*'.repeat(30)} starting deploying contracts `.padEnd(120, '*'))
    this.logger.log(`${'-'.repeat(60)} config `.padEnd(120, '-'))
    const {deployer, networks, contracts, ...secureConfig} = this.config
    this.logger.log(secureConfig)
    this.logger.log('-'.repeat(120))
    this.compileContracts()
    await this.deployContracts(chain, providerURL, options.reset)
    this.logger.log(`${'*'.repeat(30)} finished deploying contracts `.padEnd(120, '*'))
  }

  compileContracts() {
    this.logger.log(`compiling contracts `.padEnd(120, '.'))
    execSync(`npx hardhat compile --quiet --config ${process.env.PWD}/hardhat.config.cjs`)
  }

  async deployContracts(chain, providerURL, reset) {
    const provider = new JsonRpcProvider(providerURL)
    const signer = new Wallet(this.config.deployer.privateKey, provider)
    const contracts = this.config.contracts[chain]
    const deployedContracts = this.store.get(chain).contracts

    this.logger.log(`deploying contracts: [${Object.keys(contracts)}] `.padEnd(120, '.'))
    if (!this.store.get(chain).block) { // establish start block // fixme:deploy: is it ever used?
      this.store.update(chain, {block: await provider.getBlockNumber()})
    }
    for (let [name, {libraries, params}] of Object.entries(contracts)) {
      if (deployedContracts[name]?.address && !reset) continue // ...  already deployed, so skip it

      const getContractAddress = (name) => deployedContracts[name]?.address
      const translateAddresses = (params = []) => params.map(_ => Array.isArray(_) ? translateAddresses(_) : getContractAddress(_) || _)
      const translateLibraries = (names = []) => names.reduce((result, _) => Object.assign(result, ({[_]: getContractAddress(_)})), {})

      this.logger.log(`deploying ${name} contract `.padEnd(120, '.'))
      libraries = translateLibraries(libraries)
      params = translateAddresses(params)
      const contract = await deployContract(name, params, {libraries, signer})
      const address = contract.target
      const blockCreated = await provider.getTransactionReceipt(contract.deploymentTransaction().hash).then(_ => _?.blockNumber || -1)
      this.store.update(chain, {contracts: {[name]: {address, blockCreated}}})
      await setTimeout(200) // note: must wait a bit to avoid "Nonce too low" error
    }
  }
}
