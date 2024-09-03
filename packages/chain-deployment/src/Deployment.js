import {setTimeout as sleep} from 'node:timers/promises'
import {Contract, Wallet} from 'ethers'
import {deployContract} from './hardhat.js'

export class Deployment {
  constructor(provider, privateKey, verifier, logger = console) {
    this.provider = provider
    this.wallet = new Wallet(privateKey, provider)
    this.verifier = verifier
    this.logger = logger
  }

  async getContract(json, sourcePath, libraries, params) {
    return this.deployContract(json, sourcePath, libraries, params)
  }

  async deployContract(json, sourcePath, libraries, params) {
    const {contractName, bytecode} = json
    this.logger.log(`deploying ${contractName} contract `.padEnd(120, '.'))
    const contract = await deployContract(contractName, params, {libraries, signer: this.wallet})
    const result = {
      address: contract.target,
      blockCreated: await this.provider.getTransactionReceipt(contract.deploymentTransaction().hash).then(_ => _.blockNumber),
    }
    this.logger.log(contractName, result)
    await sleep(500) // note: must wait a bit to avoid "Nonce too low" error
    if (!!this.verifier) {
      const constructor = contract.deploymentTransaction().data.substring(bytecode.length)
      await this.verifier.verifyCode(contractName, contract.target, sourcePath, constructor, params)
    }
    return result
  }
}
