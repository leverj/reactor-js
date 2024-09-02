import networks from '@leverj/chain-deployment/src/networks.json' assert {type: 'json'}
import {G2ToNumbers, newKeyPair} from '@leverj/reactor.mcl'
// import {createFromJSON} from '@libp2p/peer-id-factory'

const deployer = {
  address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  privateKey: 'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
}

const chain = {
  id: 1,
  name: 'Ethereum',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
}

const publicKey = G2ToNumbers(newKeyPair().pubkey)
// const publicKey = 'CAESIOf1KYYMB/P5g7E2vR3m6wbgyehLcTcJxAIxFcgPzkI1'
// const publicKey = await createFromJSON({
//   privKey: 'CAESQK0/fGhAG26fRXLTxDyV7LpSreIfOXSJ+krI+BdTbeJq5/UphgwH8/mDsTa9HebrBuDJ6EtxNwnEAjEVyA/OQjU',
//   pubKey: 'CAESIOf1KYYMB/P5g7E2vR3m6wbgyehLcTcJxAIxFcgPzkI1',
//   id: '12D3KooWRRqAo5f41sQmc9BpsfqarZgd7PWUiX14Mz1htXDEc7Gp',
// }).then(_ => _.pubKey)

const contracts = {
  BnsVerifier: {},
  Vault: {
    libraries: ['BnsVerifier'],
    params: [chain.id, chain.nativeCurrency.name, chain.nativeCurrency.symbol, chain.nativeCurrency.decimals, publicKey],
  },
}

//fixme: bad practice modifying global in-place
function getNetworks() {
  for (const [key, network] of Object.entries(networks)) {
    network.providerURL = process.env[`${key.toUpperCase().replaceAll('-', '_')}_PROVIDER_URL`]
    network.apiKey = process.env[`${key.split('-')[0].toUpperCase()}_API_KEY`] || process.env.ETHERSCAN_API_KEY
  }
  return networks
}

export const config = {
  deployer,
  contracts,
  networks: getNetworks(),
}
