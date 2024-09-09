import {networks} from '@leverj/chain-deployment'
import {Map, Set} from 'immutable'
import {existsSync, mkdirSync, writeFileSync} from 'node:fs'

const targetChains = Set([
  'arbitrum',
  'avalanche',
  'base',
  'bsc',
  'cronos',
  'fantom',
  'filecoin',
  'linea',
  'mainnet',
  'optimism',
  'polygon',
])
const targetDir = `${process.env.PWD}/test/hardhat/mainnets`
const template = (chainId, blockNumber) => `require('dotenv').config()
const root = \`\${process.env.PWD}/../chain\`

module.exports = Object.assign(require(\`\${root}/hardhat.config.cjs\`), {
  paths: {
    root,
  },
  networks: {
    hardhat: {
      chainId: ${chainId},
      gasPrice: 0,
      initialBaseFeePerGas: 0,
      forking: {
        url: \`https://mainnet.infura.io/v3/\${process.env.INFURA_API_KEY}\`,
        blockNumber: ${blockNumber},
      }
    }
  }
})`

if (!existsSync(targetDir)) mkdirSync(targetDir, {recursive: true})
Map(networks).filter(_ => !_.testnet && targetChains.has(_.label)).forEach(_ => {
  const blockNumber = Map(_.contracts || {}).reduce((result, _) => Math.min(result, _.blockCreated || result), Number.MAX_SAFE_INTEGER)
  const file = `${targetDir}/${_.label}.config.cjs`
  if (!existsSync(file)) writeFileSync(file, template(_.id, blockNumber))
})

const candidateChains_infura = Set([
  'arbitrum',
  'arbitrumNova',
  'avalanche',
  'base',
  'bsc',
  'cronos',
  'fantom',
  'filecoin',
  'linea',
  'mainnet',
  'optimism',
  'polygon',
  'zkSync',
  'zksync',
])
const candidateChainsIds_infura = Set([
  42161n,
  42170n,
  43114n,
  8453n,
  56n,
  25n,
  1n,
  5n,
  250n,
  314n,
  59144n,
  59141n,
  10n,
  137n,
  80002n,
  324n,
])
if (false) {
  const chains = Map(networks).filter(_ => !_.testnet && candidateChainsIds_infura.has(_.id)).keySeq().toArray().sort()
  console.log(chains.map(_ => `'${_}',`).join('\n'))
}
