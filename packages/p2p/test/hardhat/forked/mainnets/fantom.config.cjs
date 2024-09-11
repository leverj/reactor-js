require('dotenv').config()
const root = `${process.env.PWD}/../chain`

module.exports = Object.assign(require(`${root}/hardhat.config.cjs`), {
  paths: {
    root,
  },
  networks: {
    hardhat: {
      chainId: 1337,
      gasPrice: 0,
      initialBaseFeePerGas: 0,
      forking: {
        url: `https://rpc.ftm.tools/`,
        chainId: 1337,
      }
    }
  }
})
