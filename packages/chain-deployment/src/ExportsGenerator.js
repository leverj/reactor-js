import {Interface} from 'ethers'
import * as glob from 'glob'
import {execSync} from 'node:child_process'
import {mkdirSync, rmSync, writeFileSync} from 'node:fs'

function establishCleanDir(dir) {
  rmSync(dir, {recursive: true, force: true})
  mkdirSync(dir, {recursive: true})
  return dir
}

export class ExportsGenerator {
  constructor(projectDir, contracts, logger = console) {
    this.projectDir = projectDir
    this.contracts = contracts
    this.logger = logger
  }

  async generate() {
    await this.exportAbi()
    await this.exportEvents()
    this.exportStubs()
  }

  async exportAbi() {
    this.logger.log(`${'-'.repeat(30)} generating contracts abi exports `.padEnd(120, '-'))
    const targetDir = establishCleanDir(`${this.projectDir}/src/contracts/abi`)
    execSync(`npx hardhat compile --quiet --config ${this.projectDir}/hardhat.config.cjs`)
    const dirs = glob.sync(`${this.projectDir}/artifacts/contracts/**/*.sol`)
    for (let name of this.contracts) {
      const path = dirs.find(_ => _.endsWith(`/${name}.sol`))
      const {default: {contractName, abi}} = await import(`${path}/${name}.json`, {assert: {type: 'json'}})
      writeFileSync(`${targetDir}/${name}.json`, JSON.stringify({contractName, abi}, null, 2))
      this.logger.log(`extracted abi for: ${contractName} `.padEnd(120, '.'))
    }
    const source = this.contracts.map(_ => `export const {default: ${_}} = await import('./${_}.json', {assert: {type: 'json'}})`).join('\n')
    writeFileSync(`${targetDir}/index.js`, source)
  }

  async exportEvents() {
    this.logger.log(`${'-'.repeat(30)} generating contracts event exports `.padEnd(120, '-'))
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
      writeFileSync(`${targetDir}/${contractName}.js`, source)
      this.logger.log(`extracted events for: ${contractName} `.padEnd(120, '.'))
    }
    const exports = this.contracts.map(_ => `export * as ${_} from './${_}.js'`).join('\n')
    writeFileSync(`${targetDir}/index.js`, exports)
  }

  exportStubs() {
    this.logger.log(`${'-'.repeat(30)} generating contracts stub exports `.padEnd(120, '-'))
    const exports = this.contracts.map(_ => `export const ${_} = (address, signer) => new Contract(address, abi.${_}.abi, signer)`).join('\n')
    const source = `import {Contract} from 'ethers'
import * as abi from './abi/index.js'

${exports}`
    writeFileSync(`${this.projectDir}/src/contracts/stubs.js`, source)
  }
}
