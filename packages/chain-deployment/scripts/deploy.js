import {Deploy} from '@leverj/chain-deployment'
import {logger} from '@leverj/common'
import {execSync} from 'node:child_process'
import yargs from 'yargs/yargs'

const config = {} //fixme:deploy: how to pass in config?

execSync('npx hardhat compile')
const {reset, chain} = yargs(process.argv.slice(2)).usage('Usage: $0 --reset --chain=[chain]').argv
const deploy = Deploy.from(config, logger)
await deploy.to(chain, {reset}).catch(logger.error)
