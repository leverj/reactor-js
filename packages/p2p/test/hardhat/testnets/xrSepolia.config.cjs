const root = `${process.env.PWD}/../chain`

module.exports = Object.assign(require(`${root}/hardhat.config.cjs`), {
  paths: {
    root,
  },
  networks: {
    xrSepolia: {
      chainId: 2730,
      gasPrice: 0,
      initialBaseFeePerGas: 0,
    }
  }
})