const root = `${process.env.PWD}/../chain`

module.exports = Object.assign(require(`${root}/hardhat.config.cjs`), {
  paths: {
    root,
  },
  networks: {
    rss3Sepolia: {
      chainId: 2331,
      gasPrice: 0,
      initialBaseFeePerGas: 0,
    }
  }
})