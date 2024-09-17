import {default as hardhat} from 'hardhat'

/** https://hardhat.org/hardhat-network-helpers/docs/reference */
export * as evm from '@nomicfoundation/hardhat-network-helpers'

export const {
  config,
  ethers,
  network,
  switchNetwork,
} = hardhat

/** https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-ethers#helpers */
export const {
  provider,
  deployContract,
  getContractFactory,
  getContractAt,
  getSigners,
  getSigner,
  getImpersonatedSigner,
  getContractFactoryFromArtifact,
  getContractAtFromArtifact,
} = ethers

const {mnemonic, path} = config.networks.hardhat.accounts, phrase = ethers.Mnemonic.fromPhrase(mnemonic)
export const chainId = await provider.getNetwork().then(_ => _.chainId)
export const accounts = await getSigners()
export const wallets = accounts.map((value, i) => ethers.HDNodeWallet.fromMnemonic(phrase, `${path}/${i}`))
