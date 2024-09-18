const root = `${process.env.PWD}/../chain`

module.exports = Object.assign(require(`${root}/hardhat.config.cjs`), {
  paths: {
    root,
  },
  networks: {
    hardhat: {
      chainId: 5000, /** mantle **/
      gasPrice: 0,
      initialBaseFeePerGas: 0,
    }
  }
})