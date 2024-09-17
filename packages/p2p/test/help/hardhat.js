import {provider} from '@leverj/chain-deployment/test'

export const MasqueradingProvider = (chainId, name = 'hardhat') => ({
  estimateGas: async (...args) => provider.estimateGas(...args),
  getBalance: async (...args) => provider.getBalance(...args),
  getBlockNumber: async () => provider.getBlockNumber(),
  getLogs: async (...args) => provider.getLogs(...args),
  getNetwork: async () => ({chainId, name}),
  send: async (...args) => provider.send(...args),
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
