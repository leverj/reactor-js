import {default as hardhat} from 'hardhat'

export const {ethers} = hardhat
export const {deployContract, getSigners, provider, ZeroAddress} = ethers
export const chainId = await provider.getNetwork().then(_ => _.chainId)
export const accounts = await getSigners()
export const MasqueradingProvider = (provider, chainId) => ({
  getNetwork: async () => provider.getNetwork().then(_ => {
    _.chainId = chainId
    return _
  }),
  getBlockNumber: async () => provider.getBlockNumber(),
  getLogs: async (filter) => provider.getLogs(filter),
})
