require('dotenv').config()
const root = `${process.env.PWD}/../chain`

module.exports = Object.assign(require(`${root}/hardhat.config.cjs`), {
  paths: {
    root,
  },
  networks: {
    hardhat: {
      chainId: 11297108099,
      gasPrice: 0,
      initialBaseFeePerGas: 0,
      forking: {
        url: `https://palm-testnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
        blockNumber: 15429248,
      }
    }
  }
})