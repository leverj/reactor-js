const root = `${process.env.PWD}/../chain`

module.exports = Object.assign(require(`${root}/hardhat.config.cjs`), {
  paths: {
    root,
  },
  networks: {
    kakarotSepolia: {
      chainId: 1802203764,
      gasPrice: 0,
      initialBaseFeePerGas: 0,
    }
  }
})