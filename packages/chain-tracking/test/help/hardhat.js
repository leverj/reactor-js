import * as hardhat from 'hardhat'

export const {ethers} = hardhat.default
export const {deployContract, getContractFactory, getSigners, provider, getContractAt, ZeroAddress} = ethers
export const chainId = await provider.getNetwork().then(_ => _.chainId)
