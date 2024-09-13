import {Deploy} from '@leverj/chain-deployment'
import {logger} from '@leverj/common'
import {execSync} from 'child_process'
import yargs from 'yargs/yargs'
import config from '../config.js'

execSync('npx hardhat compile')
//fixme: chain must be passed in!
const {reset, chain} = yargs(process.argv.slice(2)).usage('Usage: $0 --reset --chain=[chain]').argv
if (chain) config.chain = chain // override chain if supplied
await Deploy.from(config, {reset, logger}).run().catch(logger.error)
