import {provider} from '@leverj/chain-deployment/test'

export const MasqueradingProvider = (chainId, name = 'hardhat') => ({
  getNetwork: async () => ({chainId, name}),
  getBlockNumber: async () => provider.getBlockNumber(),
  getLogs: async (filter) => provider.getLogs(filter),
})

export class Chain {
  static async from(provider) {
    const {chainId, name} = await provider.getNetwork()
    return new this(chainId, name === 'unknown' ? 'hardhat' : name, provider)
  }

  constructor(id, label, provider) {
    this.id = id
    this.label = label
    this.provider = provider
  }
}
