import {writeFileSync} from 'node:fs'
import {getNetworks} from './api.js'

const networks = await getNetworks()
const file = `${import.meta.dirname}/networks.json`
writeFileSync(file, JSON.stringify(Object.values(networks), null, 2))
