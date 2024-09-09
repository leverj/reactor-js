const root = `${process.env.PWD}/../chain`

module.exports = Object.assign(require(`${root}/hardhat.config.cjs`), {
  paths: {
    root,
  },
  networks: {
    hardhat: {
      chainId: 80001,
      gasPrice: 0,
      initialBaseFeePerGas: 0,
    }
  }
})