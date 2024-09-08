require('dotenv').config()
// processes.push(exec(`npx hardhat node --fork ${url} --fork-block-number ${blockNumber} --port ${port}`)) //fixme:fork

module.exports = Object.assign(require('../chain/hardhat.config.cjs'), {
  paths: {
    root: '../chain',
  },
  networks: {
    hardhat: {
      chainId: 1,
      gasPrice: 0,
      initialBaseFeePerGas: 0,
      forking: {
        url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
        blockNumber: 20711000
      }
    },
  },
})
