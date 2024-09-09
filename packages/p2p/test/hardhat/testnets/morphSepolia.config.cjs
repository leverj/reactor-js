const root = `${process.env.PWD}/../chain`

module.exports = Object.assign(require(`${root}/hardhat.config.cjs`), {
  paths: {
    root,
  },
  networks: {
    morphSepolia: {
      chainId: 2710,
      gasPrice: 0,
      initialBaseFeePerGas: 0,
    }
  }
})