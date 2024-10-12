import {ExportsGenerator} from '@leverj/lever.chain-deployment'
import {logger} from '@leverj/lever.common'
import {execSync} from 'node:child_process'

execSync('npx hardhat compile')
const contractNames = ['Vault']
const exporter = new ExportsGenerator(`${import.meta.dirname}/..`, contractNames, logger)
await exporter.generate()
