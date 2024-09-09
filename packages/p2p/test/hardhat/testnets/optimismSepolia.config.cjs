const root = `${process.env.PWD}/../chain`

module.exports = Object.assign(require(`${root}/hardhat.config.cjs`), {
  paths: {
    root,
  },
  networks: {
    optimismSepolia: {
      chainId: 11155420,
      gasPrice: 0,
      initialBaseFeePerGas: 0,
    }
  }
})