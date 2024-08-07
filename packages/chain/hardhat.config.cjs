module.exports = Object.assign(require('@leverj/chain-deployment/hardhat.config.cjs'), {
  networks: {
    test: {
      url: 'http://127.0.0.1:8545',
      gasPrice: 0,
      defaultBalanceEther: 10,
    },
  },
})
