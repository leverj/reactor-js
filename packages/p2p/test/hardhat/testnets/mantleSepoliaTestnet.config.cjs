const root = `${process.env.PWD}/../chain`

module.exports = Object.assign(require(`${root}/hardhat.config.cjs`), {
  paths: {
    root,
  },
  networks: {
    mantleSepoliaTestnet: {
      chainId: 5003,
      gasPrice: 0,
      initialBaseFeePerGas: 0,
    }
  }
})