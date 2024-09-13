import {ExportsGenerator} from '@leverj/chain-deployment'
import {logger} from '@leverj/common'
import {execSync} from 'child_process'

execSync('npx hardhat compile')
const contractNames = ['Bank']
const exporter = new ExportsGenerator(`${import.meta.dirname}/..`, contractNames, logger)
await exporter.generate()
