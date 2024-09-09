const root = `${process.env.PWD}/../chain`

module.exports = Object.assign(require(`${root}/hardhat.config.cjs`), {
  paths: {
    root,
  },
  networks: {
    blastSepolia: {
      chainId: 168587773,
      gasPrice: 0,
      initialBaseFeePerGas: 0,
    }
  }
})