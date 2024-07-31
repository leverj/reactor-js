process.env.NODE_ENV = 'test'
import {ExportsGenerator} from '@leverj/chain-deployment'

//fixme
// const contractNames = Object.keys(config.contracts)
const contractNames = ['BlsVerify', 'Vault']
const exporter = new ExportsGenerator(process.env.PWD, contractNames)
await exporter.generate()
