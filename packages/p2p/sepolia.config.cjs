module.exports = Object.assign(require('../chain/hardhat.config.cjs'), {
  paths: {
    root: '../chain',
  },
  networks: {
    hardhat: {
      chainId: 11155111,
      gasPrice: 0,
      initialBaseFeePerGas: 0,
    },
  },
})
