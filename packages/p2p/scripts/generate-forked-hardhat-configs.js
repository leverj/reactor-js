import {networks} from '@leverj/chain-deployment'
import {Map} from 'immutable'
import {existsSync, mkdirSync, writeFileSync} from 'node:fs'

const infura_supported_chains = Map([

  // Arbitrum
  ['arbitrum', 'arbitrum-mainnet', 42161n],
  ['arbitrumSepolia', 'arbitrum-sepolia', 421614n],

  // Avalanche
  ['avalanche', 'avalanche-mainnet', 43114n],
  ['avalancheFuji', 'avalanche-fuji', 43113n],

  // Blast
  ['blast', 'blast-mainnet', 81457n],
  ['blastSepolia', 'blast-sepolia', 168587773n],

  // Binance Smart Chain
  ['bsc', 'bsc-mainnet', 56n],
  ['bscTestnet', 'bsc-testnet', 97n],

  // Celo
  ['celo', 'celo-mainnet', 42220n],
  ['celoAlfajores', 'celo-alfajores', 44787n],

  // Ethereum
  ['mainnet', 'mainnet', 1n],
  ['holesky', 'holesky', 17000n],
  ['sepolia', 'sepolia', 11155111n],

  // Linea
  ['linea', 'linea-mainnet', 59144n],
  ['lineaSepolia', 'linea-sepolia', 59141n],

  // Mantle
  ['mantle', 'mantle-mainnet', 5000n],
  ['mantleSepoliaTestnet', 'mantle-sepolia', 5003n],

  // opBNB
  ['opBNB', 'opbnb-mainnet', 204n],
  ['opBNBTestnet', 'opbnb-testnet', 5611n],

  // Optimism
  ['optimism', 'optimism-mainnet', 10n],
  ['optimismSepolia', 'optimism-sepolia', 11155420n],

  // Palm
  ['palm', 'palm-mainnet', 11297108109n],
  ['palmTestnet', 'palm-testnet', 11297108099n],

  // Polygon PoS
  ['polygon', 'polygon-mainnet', 137n],
  ['polygonAmoy', 'polygon-amoy', 80002n],

  // ZKsync Era
  ['zksync', 'zksync-mainnet', 324n],
  ['zksyncSepoliaTestnet', 'zksync-sepolia', 300n],
].map(([label, infura_label, id]) => [label, {label, infura_label, id}]))

const targetDir = `${process.env.PWD}/test/hardhat/forked`
const template = (chainId, infura_label, blockNumber) => `require('dotenv').config()
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
        url: \`https://${infura_label}.infura.io/v3/\${process.env.INFURA_API_KEY}\`,
        blockNumber: ${blockNumber},
      }
    }
  }
})`

Map(networks).filter(_ => infura_supported_chains.has(_.label)).forEach(_ => {
  const blockNumber = Map(_.contracts || {}).reduce((result, _) => Math.min(result, _.blockCreated || result), Number.MAX_SAFE_INTEGER)
  const dir = `${targetDir}/${_.testnet ? 'testnets' : 'mainnets'}`
  if (!existsSync(dir)) mkdirSync(dir, {recursive: true})
  const file = `${dir}/${_.label}.config.cjs`
  const infura_label = infura_supported_chains.get(_.label).infura_label
  if (!existsSync(file)) writeFileSync(file, template(_.id, infura_label, blockNumber))
})
