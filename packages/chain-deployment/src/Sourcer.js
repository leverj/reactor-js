import {execSync} from 'child_process'
import * as glob from 'glob'
import {loadJson} from './load-json.js'


export class Sourcer {
  constructor(projectDir, contracts, config) {
    this.contracts = contracts
    this.buildDir = `${projectDir}/artifacts`
    this.sourceDir = `${projectDir}/contracts`
    this.targetDir = `${config.deploymentDir}/contracts`
  }

  getJson(contract) { return loadJson(`${this.targetDir}/${contract}.json`) }
  getSourcePath(contract) { return `${this.targetDir}/${contract}.sol` }

  async sourceContracts() {
    console.log(`compiling contracts `.padEnd(120, '.'))
    execSync(`rm -rf ${this.targetDir} && mkdir -p ${this.targetDir}`)
    execSync(`npx hardhat compile --quiet --config ${process.env.PWD}/hardhat.config.cjs`)
    const artifacts = glob.sync(`${this.buildDir}/**/*.sol`)
    const sources = glob.sync(`${this.sourceDir}/**/*.sol`)
    for (let name of Object.keys(this.contracts)) {
      const abi_path = artifacts.find(_ => _.endsWith(`/${name}.sol`))
      const source_path = sources.find(_ => _.endsWith(`/${name}.sol`))
      execSync(`cp -r ${abi_path}/${name}.json ${this.targetDir}/`)
      execSync(`npx hardhat flatten ${source_path} | awk '/SPDX-License-Identifier/&&c++>0 {next} 1' > ${this.targetDir}/${name}.sol`)
    }
  }
}
