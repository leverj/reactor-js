import {deployContract, getContractFactory} from './hardhat.js'

export const attach = async (name, address) => getContractFactory(name).then(_ => _.attach(address))

export const ERC20 = async (name = 'Crap', symbol = 'CRAP') => deployContract('ERC20Mock', [name, symbol])
export const ERC20Proxy = async (name, symbol, decimals, token, chainId) => deployContract('ERC20Proxy', [name, symbol, decimals, token, chainId])
export const BlsVerify = async () => deployContract('BlsVerify', [])
export const Vault = async (chainId, publicKey, verifier) => deployContract('Vault', [chainId, publicKey])
