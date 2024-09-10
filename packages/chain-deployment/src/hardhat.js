import {default as hardhat} from 'hardhat'

/** https://hardhat.org/hardhat-network-helpers/docs/reference */
export * as evm from '@nomicfoundation/hardhat-network-helpers'

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
