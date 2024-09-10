require('dotenv').config()
const root = `${process.env.PWD}/../chain`

module.exports = Object.assign(require(`${root}/hardhat.config.cjs`), {
  paths: {
    root,
  },
  networks: {
    hardhat: {
      chainId: 59144,
      gasPrice: 0,
      initialBaseFeePerGas: 0,
      forking: {
        url: `https://linea-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
        blockNumber: 42,
      }
    }
  }
})