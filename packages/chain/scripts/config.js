import {networks} from '@leverj/chain-deployment'
import {G2ToNumbers, PublicKey} from '@leverj/reactor.mcl'

const projectDir = `${import.meta.dirname}/../../..`

const publicKey = 'CAESIOf1KYYMB/P5g7E2vR3m6wbgyehLcTcJxAIxFcgPzkI1'

const configureContracts = (network, publicKey) => {
  const {id, nativeCurrency: {name, symbol, decimals}} = network
  return {
    BnsVerifier: {},
    Vault: {
      libraries: ['BnsVerifier'],
      params: [id, name, symbol, decimals, G2ToNumbers(new PublicKey(publicKey))],
    },
  }
}

export const configure = (chain) => ({
  networks: {[chain]: networks[chain]},
  env: 'test',
  deployer: {
    privateKey: 'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  },
  deploymentDir: `${projectDir}/data/chain`,
  contracts: configureContracts(networks[chain], publicKey),
})
