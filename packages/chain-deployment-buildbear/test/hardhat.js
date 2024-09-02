import {default as hardhat} from 'hardhat'

export const {ethers} = hardhat
export const {ignition, run} = hardhat
export const {deployContract, getSigners, provider} = ethers
export const chainId = await provider.getNetwork().then(_ => _.chainId)
export const accounts = await getSigners()
