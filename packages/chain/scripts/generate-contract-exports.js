process.env.NODE_ENV = 'test'
import {ExportsGenerator} from '@leverj/chain-deployment'
import {logger} from '@leverj/common/utils'

const contractNames = ['Vault']
const exporter = new ExportsGenerator(process.env.PWD, contractNames, logger)
await exporter.generate()
