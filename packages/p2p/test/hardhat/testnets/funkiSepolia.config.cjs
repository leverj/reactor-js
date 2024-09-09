const root = `${process.env.PWD}/../chain`

module.exports = Object.assign(require(`${root}/hardhat.config.cjs`), {
  paths: {
    root,
  },
  networks: {
    funkiSepolia: {
      chainId: 3397901,
      gasPrice: 0,
      initialBaseFeePerGas: 0,
    }
  }
})