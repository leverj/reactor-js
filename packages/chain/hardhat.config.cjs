module.exports = Object.assign(require('@leverj/chain-deployment/hardhat.config.cjs'), {
  networks: {
    hardhat: {
      gasPrice: 0,
      initialBaseFeePerGas: 0,
    },
  },
})
