const root = `${process.env.PWD}/../chain`

module.exports = Object.assign(require(`${root}/hardhat.config.cjs`), {
  paths: {
    root,
  },
  networks: {
    sepolia: {
      chainId: 11155111,
      gasPrice: 0,
      initialBaseFeePerGas: 0,
    }
  }
})