import {networks} from '@leverj/chain-deployment'
import {configure} from '@leverj/config/src/index.js'
import {G2ToNumbers, PublicKey} from '@leverj/reactor.mcl'
import {Map, Set} from 'immutable'

const dataDir = `${import.meta.dirname}/../../data`

const schema = {
  env: {
    doc: 'The application environment',
    format: ['livenet', 'production', 'develop', 'dev', 'e2e', 'test'],
    default: 'livenet',
    env: 'NODE_ENV',
  },
  deploymentDir: {
    doc: 'will output the .evms.json file under `${deploymentDir}/env/${env}',
    format: String,
    default: `${dataDir}/chain`,
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
  vault: {
    publicKey: {
      format: '*',
      default: null,
      nullable: false,
      sensitive: true,
      env: 'VAULT_PUBLIC_KEY',
    },
  },
  chains: {
    doc: 'all possible chains to deploy to',
    format: Array,
    default: ['arbitrum', 'avalanche', 'bsc', 'gnosis', 'linea', 'mainnet', 'optimism', 'polygon', 'polygonZkEvm'],
    env: 'CHAINS',
  },
  chain: {
    doc: 'the chain to deploy to',
    format: String,
    default: 'mainnet',
    env: 'CHAIN',
  },
}

function postLoad(config) {
  config.networks = configureNetworks(config)
  config.contracts = configureContracts(config)
  return config
}

function configureNetworks(config) {
  const chains = Set(config.chains)
  return Map(networks).filter(_ => chains.has(_.label)).toJS()
}

function configureContracts(config) {
  const {vault, networks} = config
  const publicKey = G2ToNumbers(new PublicKey(vault.publicKey))
  return Map(networks).map(({id, nativeCurrency: {name, symbol, decimals}}) => ({
      BnsVerifier: {},
      Vault: {
        libraries: ['BnsVerifier'],
        params: [id, name, symbol, decimals, G2ToNumbers(new PublicKey(publicKey))],
      },
    }),
  ).toJS()
}

export default await configure(schema, postLoad)
