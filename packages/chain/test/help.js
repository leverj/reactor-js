const {ethers: {deployContract, getContractFactory, getSigners}} = require('hardhat')

async function deploy(name, args) {
  return await deployContract(name, args)
}
function stringToHex(str) {
  let hex = ''
  for (let i = 0; i < str.length; i++) {
    hex += '' + str.charCodeAt(i).toString(16)
  }
  return '0x' + hex
}

module.exports = {
  deployContract,
  getContractFactory,
  getSigners,
  stringToHex,
}