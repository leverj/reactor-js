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

  async getContract({name, json, sourcePath, address}, libraries, params) {
    return address ?
      new Contract(address, json.abi, this.wallet) :
      await this.deployContract(json, sourcePath, libraries, params)
  }

  async deployContract(json, sourcePath, libraries, params) {
    const {contractName, bytecode} = json
    this.logger.log(`deploying ${contractName} contract `.padEnd(120, '.'))
    const contract = await deployContract(contractName, params, {libraries, signer: this.wallet})
    this.logger.log({
      contractName: contractName,
      address: await contract.getAddress(),
    })
    await sleep(500) // note: must wait a bit to avoid "Nonce too low" error
    if (!!this.verifier) {
      const deploymentTransaction = contract.deploymentTransaction()
      const constructor = deploymentTransaction.data.substring(bytecode.length)
      await this.verifier.verifyCode(contractName, await contract.getAddress(), sourcePath, constructor, params)
    }
    return contract
  }
}
