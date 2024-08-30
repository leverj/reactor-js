import {default as hardhat} from 'hardhat'

export const {ethers} = hardhat
export const {deployContract, getSigners, provider, getContractAt, ZeroAddress} = ethers
export const chainId = await provider.getNetwork().then(_ => _.chainId)
export const accounts = await getSigners()
export const ETH = ZeroAddress
