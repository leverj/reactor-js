import {writeFileSync} from 'node:fs'
import * as chains from 'viem/chains'

const file = `${import.meta.dirname}/chains.json`
writeFileSync(file, JSON.stringify(chains, null, 2))
