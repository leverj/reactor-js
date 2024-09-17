import {ExportsGenerator} from '@leverj/chain-deployment'
import {logger} from '@leverj/common'
import {execSync} from 'child_process'

execSync('npx hardhat compile')
const contractNames = ['Vault']
const exporter = new ExportsGenerator(process.env.PWD, contractNames, logger)
await exporter.generate()
