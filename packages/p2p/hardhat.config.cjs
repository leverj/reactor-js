// require('solidity-coverage')

require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-etherscan')


module.exports = {
  networks: {
    test: {
      url: 'http://127.0.0.1:8545',
      gasLimit: 6000000000,
      defaultBalanceEther: 10,
    },
  },
  solidity: {
    version: '0.8.26',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
}

