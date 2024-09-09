import {default as hardhat} from 'hardhat'
import {HDNodeWallet, Mnemonic} from 'ethers'

//fixme: expose everything possibly needed
export const {config, ethers} = hardhat
export const {deployContract, getContractAt, getSigners, provider} = ethers
const {mnemonic, path} = config.networks.hardhat.accounts, phrase = Mnemonic.fromPhrase(mnemonic)

export const chainId = await provider.getNetwork().then(_ => _.chainId)
export const accounts = await getSigners()
export const wallets = accounts.map((value, i) => HDNodeWallet.fromMnemonic(phrase, `${path}/${i}`))

//fixme: maybe
export const MasqueradingProvider = (provider, chainId) => ({
  getNetwork: async () => provider.getNetwork().then(_ => {
    _.chainId = chainId
    return _
  }),
  getBlockNumber: async () => provider.getBlockNumber(),
  getLogs: async (filter) => provider.getLogs(filter),
})
