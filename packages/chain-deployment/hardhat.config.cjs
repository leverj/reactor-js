require('@nomiclabs/hardhat-etherscan')
require('hardhat-gas-reporter')
require('hardhat-switch-network')
require('xdeployer')

module.exports = {
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
}
