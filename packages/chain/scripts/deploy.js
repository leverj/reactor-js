import {Deploy, networks} from '@leverj/chain-deployment'
import {logger} from '@leverj/common'
import {execSync} from 'child_process'
import yargs from 'yargs/yargs'
import {configure} from './config.js' //fixme:config

execSync('npx hardhat compile')
const {
  reset,
  skipVerify,
  network,
} = yargs(process.argv.slice(2)).usage('Usage: $0 --reset --skip-verify --network=[network]').argv
const config = configure(network, networks)
const deploy = await Deploy.from(process.env.PWD, config, {reset, skipVerify, network, logger})
await deploy.run().catch(console.error)
