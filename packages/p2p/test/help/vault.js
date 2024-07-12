import {deployContract, getSigners, getContractAt} from './hardhat.cjs'
export {provider} from './hardhat.cjs'

export const [owner, account1, account2, account3, account4, account5, account6, account7, account8, account9] = await getSigners()
export const createVault = async (chainId, pubkey_ser) => await deployContract('Vault', [chainId, pubkey_ser])
export const createERC20Token = async (name, symbol, decimals, token, network) => await deployContract('ERC20Token', [name, symbol, decimals, token, network])
export const createRegularERC20 = async (name, symbol) => await deployContract('RegularERC20', [name, symbol])