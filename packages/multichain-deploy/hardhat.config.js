require('@nomicfoundation/hardhat-toolbox')
require('@chainsafe/hardhat-ts-artifact-plugin')
require('@nomicfoundation/hardhat-web3-v4')
require('@chainsafe/hardhat-plugin-multichain-deploy')
const {Environment} = require('@buildwithsygma/sygma-sdk-core')
require('dotenv').config()

const {TESTNET} = Environment
const {
  PK,
  BUILDBEAR_PROVIDER_URL,
  SEPOLIA_PROVIDER_URL,
  MUMBAI_PROVIDER_URL,
  HOLESKY_PROVIDER_URL,
} = process.env
const accounts = PK ? [PK] : []

/** @type import('hardhat/config').HardhatUserConfig */

const config = {
  solidity: '0.8.20',
  networks: {
    buildbear: {
      chainId: 19898,
      url: BUILDBEAR_PROVIDER_URL,
      accounts,
    },
    sepolia: {
      chainId: 11155111,
      url: SEPOLIA_PROVIDER_URL,
      accounts,
    },
    mumbai: {
      chainId: 80001,
      url: MUMBAI_PROVIDER_URL,
      accounts,
    },
    holesky: {
      chainId: 17000,
      url: HOLESKY_PROVIDER_URL,
      accounts,
    },
  },
  multichain: {
    environment: TESTNET,
  },
  sourcify: {
    enabled: true,
    apiUrl: 'https://rpc.buildbear.io/verify/sourcify/server/wild-magik-352a145c',
  },
}
module.exports = config
