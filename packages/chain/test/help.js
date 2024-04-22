const {ethers: {deployContract, getContractFactory, getSigners}} = require('hardhat')

async function deploy(name, args) {
  return await deployContract(name, args)
}

module.exports = {
  deployContract,
  getContractFactory,
  getSigners
}