// require('solidity-coverage')
//
// module.exports = require('@leverj/chain-deployment/hardhat.config.cjs')

require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-etherscan')
require('hardhat-gas-reporter')


module.exports = {
  networks: {
    test: {
      url: 'http://127.0.0.1:8545',
      gasLimit: 6000000000,
      defaultBalanceEther: 10,
    },
  },
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
