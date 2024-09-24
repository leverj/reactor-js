import {Map, Set} from 'immutable'
import {networks} from './src/networks.js'

export const schema = {
  env: {
    doc: 'The application environment',
    format: ['livenet', 'production', 'develop', 'dev', 'e2e', 'test'],
    default: 'livenet',
    env: 'NODE_ENV',
  },
  deploymentDir: {
    doc: 'will output the .evms.json file under `${deploymentDir}/${env}',
    format: String,
    default: `${process.env.PWD}/data/chain`,
    env: 'DEPLOYMENT_DIR',
  },
  deployer: {
    privateKey: {
      format: '*',
      default: null,
      nullable: false,
      sensitive: true,
      env: 'DEPLOYER_PRIVATE_KEY',
    },
  },
  chains: {
    doc: 'all possible chains to deploy to',
    format: Array,
    default: ['mainnet'],
    env: 'CHAINS',
  },
}

export function postLoad(config) {
  const chains = Set(config.chains)
  config.networks = Map(networks).filter(_ => chains.has(_.label)).toJS()
  return config
}
