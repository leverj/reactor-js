import * as chain_deployment from '@leverj/lever.chain-deployment/config.schema'
import {deserializeHexStrToPublicKey, G2ToNumbers} from '@leverj/reactor.mcl'
import {Map} from 'immutable'

export const schema = Object.assign(chain_deployment.schema, {
  vault: {
    publicKey: {
      format: '*',
      default: null,
      nullable: false,
      sensitive: true,
      env: 'VAULT_PUBLIC_KEY',
    },
  },
})

function configureContracts(config) {
  const {vault, networks} = config
  const publicKey = G2ToNumbers(deserializeHexStrToPublicKey(vault.publicKey))
  return Map(networks).map(({id, nativeCurrency: {name, symbol, decimals}}) => ({
    BnsVerifier: {},
    Vault: {
      libraries: ['BnsVerifier'],
      params: [id, name, symbol, decimals, publicKey],
    },
  })).toJS()
}

export function postLoad(config) {
  config = chain_deployment.postLoad(config)
  config.contracts = configureContracts(config)
  return config
}
