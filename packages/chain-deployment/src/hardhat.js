import {default as hardhat} from 'hardhat'

export {
  clearSnapshots,
  impersonateAccount,
  mine,
  mineUpTo,
  reset,
  setBalance,
  stopImpersonatingAccount,
  takeSnapshot,
  time,
} from '@nomicfoundation/hardhat-network-helpers'
export const {
  config,
  ethers,
  network,
  switchNetwork,
} = hardhat
export const {
  HDNodeWallet,
  Mnemonic,
  computeAddress,
  deployContract,
  getContractAt,
  getCreateAddress,
  getCreate2Address,
  getImpersonatedSigner,
  getSigners,
  provider,
} = ethers

const {mnemonic, path} = config.networks.hardhat.accounts, phrase = Mnemonic.fromPhrase(mnemonic)
export const chainId = await provider.getNetwork().then(_ => _.chainId)
export const accounts = await getSigners()
export const wallets = accounts.map((value, i) => HDNodeWallet.fromMnemonic(phrase, `${path}/${i}`))

/** Impersonating accounts
 *
 getImpersonatedSigner(address)
 await impersonatedSigner.sendTransaction(...)
 *
 await impersonateAccount(address)
 const impersonatedSigner = await ethers.getSigner(address)
 */

/** Resetting the fork
 *
 await reset(url, blockNumber)

 Both the url and the blockNumber can be different to the ones that are currently being used by the fork.
 *
 To reset the network to a local, non-forked state, call the helper without any arguments:
 await reset()
 */

//fixme: maybe
export const MasqueradingProvider = (provider, chainId) => ({
  getNetwork: async () => provider.getNetwork().then(_ => {
    _.chainId = chainId
    return _
  }),
  getBlockNumber: async () => provider.getBlockNumber(),
  getLogs: async (filter) => provider.getLogs(filter),
})
