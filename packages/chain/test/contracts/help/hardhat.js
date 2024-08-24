import * as hardhat from 'hardhat'

export const {ethers, network, web3} = hardhat.default
export const {deployContract, getContractFactory, getSigners, provider, getContractAt} = ethers
