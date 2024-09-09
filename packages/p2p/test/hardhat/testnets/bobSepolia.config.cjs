const root = `${process.env.PWD}/../chain`

module.exports = Object.assign(require(`${root}/hardhat.config.cjs`), {
  paths: {
    root,
  },
  networks: {
    bobSepolia: {
      chainId: 808813,
      gasPrice: 0,
      initialBaseFeePerGas: 0,
    }
  }
})