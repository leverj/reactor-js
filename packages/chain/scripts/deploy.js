import config from 'config'
import yargs from 'yargs/yargs'
import {Deploy} from '@leverj/chain-deployment'
import {logger} from '@leverj/common/utils'


const {reset, skipVerify, network} = yargs(process.argv.slice(2)).usage('Usage: $0 --reset --skip-verify --network=[network]').argv
new Deploy(process.env.PWD, config, {reset, skipVerify, network, logger}).run().catch(console.error)
