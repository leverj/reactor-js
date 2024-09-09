const root = `${process.env.PWD}/../chain`

module.exports = Object.assign(require(`${root}/hardhat.config.cjs`), {
  paths: {
    root,
  },
  networks: {
    b3Sepolia: {
      chainId: 1993,
      gasPrice: 0,
      initialBaseFeePerGas: 0,
    }
  }
})