import axios from 'axios'
import {setTimeout as sleep} from 'node:timers/promises'
import solc from '@nomiclabs/hardhat-etherscan/dist/src/solc/version.js'
import changeNetwork from './change-network.js'
import {config, hardhat} from './hardhat.js'


export class Verifier {
  constructor(config, logger = console) {
    this.logger = logger
    const {deployer, network, networks} = config
    this.designatedNetwork = networks[network]
    config.networks = {
      [network]: {
        url: networks[network].providerURL || 'some url',
        chainId: networks[network].chainId,
        accounts: [`0x${deployer.privateKey}`]
      }
    }
    config.etherscan = {apiKey: networks[network].apiKey, customChains: []}
    changeNetwork(hardhat, network)
  }

  async compilerVersion() {
    return solc.getLongVersion(config.solidity.compilers[0].version)
  }

  async verifyCode(contractName, contractAddress, sourcePath, constructor, constructorArguments) {
    try {
      await this.waitUntilContractVisible(contractAddress)
      await this.verify(contractName, contractAddress, constructorArguments)
    } catch (e) {
      this.logger.error(e)
      this.logger.log('.'.repeat(120))
      this.logger.log(`!!! cannot verify contract on ${this.designatedNetwork.name} !!! `.padEnd(120, '.'))
      this.logger.log(`you will have to verify manually on ${this.designatedNetwork.browserURL}/verifyContract using the following data:`)
      this.logger.log({
        contractName,
        contractAddress,
        compilerType: 'Solidity (Single File)',
        compilerVersion: await this.compilerVersion(),
        openSourceLicenseType: 'MIT License (MIT)',
        optimization: 'Yes',
        sourcePath,
        constructor,
      })
    }
  }

  async verify(contractName, address, constructorArguments, maxAttempts = 3, attempt = 1) {
    this.logger.log(`verifying ${contractName} contract `.padEnd(120, '.'))
    try {
      await hardhat.run('verify:verify', {address, constructorArguments})
      this.logger.log(`verified ${contractName} contract `.padEnd(120, '.'))
    } catch (e) {
      if (e.message.endsWith('Reason: Already Verified')) return
      if (attempt === maxAttempts) {
        throw e
      } else {
        await sleep(attempt * 10 * 1000)
        await this.verify(contractName, address, constructorArguments, maxAttempts, attempt + 1)
      }
    }
  }

  async waitUntilContractVisible(address, maxAttempts = 6, attempt = 1) {
    const parameters = {
      module: 'account',
      action: 'txlist',
      address,
      startblock: 0,
      endblock: 99999999,
      sort: 'asc',
    }
    const url = `${this.designatedNetwork.apiURL}?${new URLSearchParams(parameters).toString()}`
    const {data: {status, message}} = await axios.get(url)
    if (status !== '0') return /* success */

    this.logger.log(`[attempt ${attempt}] - Contract ${address} is still not visible`)
    if (attempt < maxAttempts) {
      await sleep(attempt * 10 * 1000)
      await this.waitUntilContractVisible(address, maxAttempts, attempt + 1)
    } else throw Error(`Contract ${address} is not visible: ${message} [status=${status}]`)
  }
}
