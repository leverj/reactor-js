require('@nomiclabs/hardhat-etherscan')
require('hardhat-deploy')
require('hardhat-deploy-ethers')
require('hardhat-gas-reporter')
require('hardhat-switch-network')
require('xdeployer')

module.exports = {
  networks: {
    hardhat: {
      gasPrice: 0,
      initialBaseFeePerGas: 0,
    },
  },
}
