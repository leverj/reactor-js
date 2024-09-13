require('@nomicfoundation/hardhat-ethers')
require('@nomicfoundation/hardhat-network-helpers')
// require('@nomicfoundation/hardhat-verify')
require('@nomiclabs/hardhat-etherscan')
// require('hardhat-deploy')
require('hardhat-deploy-ethers')
// require('hardhat-switch-network')

module.exports = {
  solidity: '0.8.24',
  networks: {
    hardhat: {
      gasPrice: 0,
      initialBaseFeePerGas: 0,
    },
  },
}
