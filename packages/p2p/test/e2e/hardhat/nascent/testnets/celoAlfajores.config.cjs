const root = `${process.env.PWD}/../chain`

module.exports = Object.assign(require(`${root}/hardhat.config.cjs`), {
  paths: {
    root,
  },
  networks: {
    hardhat: {
      chainId: 44787,  /*** celoAlfajores ***/
      gasPrice: 0,
      initialBaseFeePerGas: 0,
    }
  }
})