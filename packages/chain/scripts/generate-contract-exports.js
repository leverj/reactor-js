import {ExportsGenerator} from '@leverj/chain-deployment'
import {logger} from '@leverj/common'
import {execSync} from 'node:child_process'

execSync('npx hardhat compile')
const contractNames = ['Vault']
const exporter = new ExportsGenerator(`${import.meta.dirname}/..`, contractNames, logger)
await exporter.generate()
