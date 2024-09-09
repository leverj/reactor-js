const root = `${process.env.PWD}/../chain`

module.exports = Object.assign(require(`${root}/hardhat.config.cjs`), {
  paths: {
    root,
  },
  networks: {
    zoraSepolia: {
      chainId: 999999999,
      gasPrice: 0,
      initialBaseFeePerGas: 0,
    }
  }
})