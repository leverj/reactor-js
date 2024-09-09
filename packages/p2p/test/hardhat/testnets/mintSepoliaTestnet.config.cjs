const root = `${process.env.PWD}/../chain`

module.exports = Object.assign(require(`${root}/hardhat.config.cjs`), {
  paths: {
    root,
  },
  networks: {
    mintSepoliaTestnet: {
      chainId: 1686,
      gasPrice: 0,
      initialBaseFeePerGas: 0,
    }
  }
})