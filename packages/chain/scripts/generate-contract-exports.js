process.env.NODE_ENV = 'test'
import {ExportsGenerator} from '@leverj/chain-deployment'

const contractNames = ['BlsVerifier', 'Vault']
const exporter = new ExportsGenerator(process.env.PWD, contractNames)
await exporter.generate()
