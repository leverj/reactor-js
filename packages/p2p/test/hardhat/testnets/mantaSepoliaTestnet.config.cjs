const root = `${process.env.PWD}/../chain`

module.exports = Object.assign(require(`${root}/hardhat.config.cjs`), {
  paths: {
    root,
  },
  networks: {
    mantaSepoliaTestnet: {
      chainId: 3441006,
      gasPrice: 0,
      initialBaseFeePerGas: 0,
    }
  }
})