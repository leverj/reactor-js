import {writeFileSync} from 'node:fs'
import {getNetworks} from './buildbear-api.js'

const networks = await getNetworks()
const file = `./scripts/buildbear-networks.json`
writeFileSync(file, JSON.stringify(Array.from(Object.values(networks)), null, 2))
