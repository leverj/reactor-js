process.env.NODE_ENV = 'test'
import {ExportsGenerator} from '@leverj/chain-deployment'
import {mkdirSync, rmSync} from 'node:fs'

function reset(path) {
  rmSync(path, {recursive: true, force: true})
  mkdirSync(path, {recursive: true})
}

for (let each of ['abi', 'events']) reset(`${process.env.PWD}/src/contracts/${each}`)
const contractNames = ['Vault']
const exporter = new ExportsGenerator(process.env.PWD, contractNames)
await exporter.generate()
