import {execSync} from 'child_process'
import fs from 'fs'
import * as glob from 'glob'
import {Interface} from 'ethers'
import {loadJson} from './load-json.js'


function establishCleanDir(dir) {
  execSync(`rm -rf ${dir}`)
  execSync(`mkdir -p ${dir}`)
  return dir
}

export class ExportsGenerator {
  constructor(projectDir, contracts) {
    this.projectDir = projectDir
    this.contracts = contracts
  }

  async generate() {
    this.exportAbi()
    await this.exportEvents()
    this.exportStubs()
  }

  exportAbi() {
    console.log(`${'-'.repeat(30)} generating contracts abi exports `.padEnd(120, '-'))
    const targetDir = establishCleanDir(`${this.projectDir}/src/contracts/abi`)
    const dirs = glob.sync(`${this.projectDir}/artifacts/contracts/**/*.sol`)
    for (let name of this.contracts) {
      const path = dirs.find(_ => _.endsWith(`/${name}.sol`))
      const contract = loadJson(`${path}/${name}.json`)
      const contractWithJustAbi = {contractName: contract.contractName, abi: contract.abi}
      fs.writeFileSync(`${targetDir}/${name}.json`, JSON.stringify(contractWithJustAbi, null, 2))
      console.log(`extracted abi for: ${contract.contractName} `.padEnd(120, '.'))
    }
    const source = this.contracts.map(_ => `export const ${_} = (await import('./${_}.json', {assert: {type: 'json'}})).default`).join('\n')
    fs.writeFileSync(`${targetDir}/index.js`, source)
  }

  async exportEvents() {
    console.log(`${'-'.repeat(30)} generating contracts event exports `.padEnd(120, '-'))
    const targetDir = establishCleanDir(`${this.projectDir}/src/contracts/events`)
    const contracts = await import(`${this.projectDir}/src/contracts/abi/index.js`)
    for (let {contractName, abi} of Object.values(contracts)) {
      const events = Interface.from(abi).fragments.filter(_ => _.type === 'event')
      const classes = events.map(_ => {
        const signature = _.format()
        const topic = _.topicHash
        const constructor_doc = _.inputs.map(({name, type}) => `* @param {${type}} ${name}`).join('\n   ')
        const constructor_signature = _.inputs.map(_ => _.name).join(', ')
        const constructor_body = _.inputs.map(_ => `this.${_.name} = ${_.name}`).join('\n    ')
        const source =
          `export class ${_.name} {
  static signature = '${signature}'
  static topic = '${topic}'

  /**
   ${constructor_doc}
   */
  constructor(${constructor_signature}) {
    ${constructor_body}
  }
}`
        return source
      })
      const source = `${classes.join('\n\n')}`
      fs.writeFileSync(`${targetDir}/${contractName}.js`, source)
      console.log(`extracted events for: ${contractName} `.padEnd(120, '.'))
    }
    const exports = this.contracts.map(_ => `export * as ${_} from './${_}.js'`).join('\n')
    fs.writeFileSync(`${targetDir}/index.js`, exports)
  }

  exportStubs() {
    console.log(`${'-'.repeat(30)} generating contracts stub exports `.padEnd(120, '-'))
    const exports = this.contracts.map(_ => `export const ${_} = (address, signer) => new Contract(address, abi.${_}.abi, signer)`).join('\n')
    const source = `import {Contract} from 'ethers'
import * as abi from './abi/index.js'

${exports}`
    fs.writeFileSync(`${this.projectDir}/src/contracts/stubs.js`, source)
  }
}
