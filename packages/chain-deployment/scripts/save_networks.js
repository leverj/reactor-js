import {writeFileSync} from 'node:fs'
import {inspect} from 'util'
import * as chains from 'viem/chains'

const targetDir = `${import.meta.dirname}/../src`
const networks = {}
for (const [label, network] of Object.entries(chains)) {
  const {id, name, nativeCurrency, rpcUrls, blockExplorers, contracts = {}, testnet = false} = network
  const providerURL = rpcUrls.default.http[0]
  const blockExplorer = blockExplorers?.default || {}
  networks[label] = {id: BigInt(id), label, name, nativeCurrency, providerURL, blockExplorer, contracts, testnet: testnet || label === 'hardhat' || label === 'localhost'}
}
writeFileSync(`${targetDir}/networks.js`, `export const networks = ${inspect(networks, {showHidden: false, compact: false, depth: null})}`)
