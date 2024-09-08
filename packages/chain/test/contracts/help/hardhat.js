import {default as hardhat} from 'hardhat'
import {HDNodeWallet, Mnemonic} from 'ethers'

export const {config, ethers} = hardhat
export const {deployContract, getSigners, provider, getContractAt, ZeroAddress} = ethers
export const chainId = await provider.getNetwork().then(_ => _.chainId)
export const accounts = await getSigners()
export const ETH = ZeroAddress

const {mnemonic, path} = config.networks.hardhat.accounts, phrase = Mnemonic.fromPhrase(mnemonic)
export const wallets = accounts.map((value, i) => HDNodeWallet.fromMnemonic(phrase, `${path}/${i}`))
