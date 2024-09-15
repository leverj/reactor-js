import * as chain_deployment from '@leverj/chain-deployment/config.schema'
import {G2ToNumbers, PublicKey} from '@leverj/reactor.mcl'
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
  const publicKey = G2ToNumbers(new PublicKey(vault.publicKey))
  return Map(networks).map(({id, nativeCurrency: {name, symbol, decimals}}) => ({
    BnsVerifier: {},
    Vault: {
      libraries: ['BnsVerifier'],
      params: [id, name, symbol, decimals, G2ToNumbers(new PublicKey(publicKey))],
    },
  })).toJS()
}

export function postLoad(config) {
  config = chain_deployment.postLoad(config)
  config.contracts = configureContracts(config)
  return config
}
