require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-etherscan')
require('@nomicfoundation/hardhat-chai-matchers')

let testnet = null
try {
  testnet = (await import('./testnet.json', {assert: {type: 'json'}})).default
} catch (e) {
}

module.exports = {
  solidity: '0.8.17',

  // defaultNetwork: testnet ? 'buildbear' : 'hardhat',
  defaultNetwork: testnet ? 'buildbear' : 'localhost',

  networks: {
    hardhat: {},
    buildbear: {
      url: testnet?.rpcUrl || '',
    },
  },

  etherscan: {
    apiKey: {
      buildbear: 'verifyContract',
    },
    customChains: [
      {
        network: 'buildbear',
        chainId: testnet?.chainId || 0,
        urls: {
          apiURL: testnet?.verificationUrl || '',
          browserURL: testnet?.explorerUrl || '',
        },
      },
    ],
  },
}
