const root = `${process.env.PWD}/../chain`

module.exports = Object.assign(require(`${root}/hardhat.config.cjs`), {
  paths: {
    root,
  },
  networks: {
    scrollSepolia: {
      chainId: 534351,
      gasPrice: 0,
      initialBaseFeePerGas: 0,
    }
  }
})