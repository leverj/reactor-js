import {provider} from '@leverj/chain-deployment/hardhat.help'

export const MasqueradingProvider = (chainId, name = 'hardhat') => ({
  estimateGas: async (...args) => provider.estimateGas(...args),
  getBalance: async (...args) => provider.getBalance(...args),
  getBlockNumber: async () => provider.getBlockNumber(),
  getLogs: async (...args) => provider.getLogs(...args),
  getNetwork: async () => ({chainId, name}),
  send: async (...args) => provider.send(...args),
})
