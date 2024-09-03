import {inspect} from 'util'
import {writeFileSync} from 'node:fs'
import {getNetworks} from './api.js'

const networks = Object.values(await getNetworks())
const chains = networks.map(_ => _.chainId)
writeFileSync(`${import.meta.dirname}/networks.js`, `export const networks = ${inspect(networks, {showHidden: false, compact: false})}`)
writeFileSync(`${import.meta.dirname}/chains.js`, `export const chains = ${inspect(chains, {showHidden: false, compact: false})}`)
