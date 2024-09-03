import {inspect} from 'util'
import {writeFileSync} from 'node:fs'
import * as chains from 'viem/chains'

const file = `${import.meta.dirname}/../src/networks.js`
const networks = {}
for (const [label, network] of Object.entries(chains)) {
  const {id, name, nativeCurrency, rpcUrls, blockExplorers, contracts} = network
  const providerURL = rpcUrls.default.http[0]
  const blockExplorer = blockExplorers?.default || {}
  networks[label] = {id, label, name, nativeCurrency, providerURL, blockExplorer, contracts}
}
writeFileSync(file, `export const networks = ${inspect(networks, {showHidden: false, compact: false, depth: null})}`)
