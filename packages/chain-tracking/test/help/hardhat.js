import * as hardhat from 'hardhat'

export const {ethers, network} = hardhat.default
export const {deployContract, getContractFactory, getSigners, provider, getContractAt, ZeroAddress} = ethers
export const {config: {chainId}} = network
