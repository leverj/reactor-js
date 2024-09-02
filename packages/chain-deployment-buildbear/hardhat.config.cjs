require('@nomicfoundation/hardhat-ignition')

module.exports = Object.assign(require('@leverj/chain-deployment/hardhat.config.cjs'), {
  solidity: '0.8.17',

  defaultNetwork: "buildbear",

  networks: {
    hardhat: {
      gasPrice: 0,
      initialBaseFeePerGas: 0,
    },
    buildbear: {
      url: "https://rpc.buildbear.io/allied-drax-414ed846",
    },
  },
})
