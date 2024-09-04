import {networks} from '@leverj/chain-deployment'
import {G2ToNumbers, PublicKey} from '@leverj/reactor.mcl'
import convict from 'convict'
// import {expand} from '@dotenvx/dotenvx'
import {Map, Set} from 'immutable'
import {existsSync} from 'node:fs'
import 'dotenv/config'

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

 async function configure(options = {}) {
  const config = convict(schema, options)
  const env = config.get('env')
  await override(`${env}.js`, config)
  await override(`local-${env}.js`, config)
  config.validate({allowed: 'strict'})
  return postLoad(config.getProperties())
}

async function override(fileName, config) {
  const path = `${import.meta.dirname}/config/${fileName}`
  if (!existsSync(path)) return
  const {default: override} = await import(path)
  config.load(override || {})
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

export default await configure()
