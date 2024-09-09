const root = `${process.env.PWD}/../chain`

module.exports = Object.assign(require(`${root}/hardhat.config.cjs`), {
  paths: {
    root,
  },
  networks: {
    liskSepolia: {
      chainId: 4202,
      gasPrice: 0,
      initialBaseFeePerGas: 0,
    }
  }
})