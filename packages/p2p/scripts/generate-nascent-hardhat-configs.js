import {networks} from '@leverj/chain-deployment'
import {ensureExistsSync} from '@leverj/common'
import {Map, Set} from 'immutable'
import {existsSync, writeFileSync} from 'node:fs'

const targetChains = Set([
  'hardhat',

  // Arbitrum
  'arbitrum',
  'arbitrumSepolia',

  // Avalanche
  'avalanche',
  'avalancheFuji',

  // Blast
  'blast',
  'blastSepolia',

  // Binance Smart Chain
  'bsc',
  'bscTestnet',

  // Celo
  'celo',
  'celoAlfajores',

  // Ethereum
  'mainnet',
  'holesky',
  'sepolia',

  // Linea
  'linea',
  'lineaSepolia',

  // Mantle
  'mantle',
  'mantleSepoliaTestnet',

  // opBNB
  'opBNB',
  'opBNBTestnet',

  // Optimism
  'optimism',
  'optimismSepolia',

  // Palm
  'palm',
  'palmTestnet',

  // Polygon PoS
  'polygon',
  'polygonAmoy',

  // ZKsync Era
  'zksync',
  'zksyncSepoliaTestnet',
])
const targetDir = `${import.meta.dirname}/../test/e2e/help/hardhat/nascent`
const template = (chainId, label) => `const root = \`\${process.env.PWD}/../chain\`

module.exports = Object.assign(require(\`\${root}/hardhat.config.cjs\`), {
  paths: {
    root,
  },
  networks: {
    hardhat: {
      chainId: ${chainId}, /** ${label} **/
      gasPrice: 0,
      initialBaseFeePerGas: 0,
    }
  }
})`

ensureExistsSync(targetDir)
Map(networks).filter(_ => targetChains.has(_.label)).forEach(_ => {
  const dir = `${targetDir}/${_.testnet ? 'testnets' : 'mainnets'}`
  ensureExistsSync(dir)
  const file = `${dir}/${_.label}.config.cjs`
  if (!existsSync(file)) writeFileSync(file, template(_.id, _.label))
})
