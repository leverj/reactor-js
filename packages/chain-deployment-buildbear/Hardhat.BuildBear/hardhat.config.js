require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-etherscan')
require('@nomicfoundation/hardhat-chai-matchers')

const testnet = require('./testnet.json') || null

module.exports = {
  solidity: '0.8.17',

  // defaultNetwork: testnet ? 'buildbear' : 'hardhat',
  defaultNetwork: testnet ? 'buildbear' : 'localhost',

  networks: {
    hardhat: {},
    buildbear: {
      url: testnet?.rpcUrl || '',
    },
  },

  etherscan: {
    apiKey: {
      buildbear: 'verifyContract',
    },
    customChains: [
      {
        network: 'buildbear',
        chainId: testnet?.chainId || 0,
        urls: {
          apiURL: testnet?.verificationUrl || '',
          browserURL: testnet?.explorerUrl || '',
        },
      },
    ],
  },
}
