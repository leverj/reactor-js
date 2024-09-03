import {Deploy} from '@leverj/chain-deployment'
import {logger} from '@leverj/common'
import {execSync} from 'child_process'
import yargs from 'yargs/yargs'
import {configure} from './config.js' //fixme:config
// import config from '../config.js'

execSync('npx hardhat compile')
const {
  reset,
  skipVerify,
  network,
} = yargs(process.argv.slice(2)).usage('Usage: $0 --reset --skip-verify --network=[network]').argv
//fixme: if network, override the config.network
const config = configure(network)
await Deploy.from(process.env.PWD, config, {reset, skipVerify, network, logger}).run().catch(console.error)
