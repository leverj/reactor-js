import {deployContract} from './hardhat.js'

export const ERC20 = async (name = 'Crap', symbol = 'CRAP') => deployContract('ERC20Mock', [name, symbol])
export const ERC20Proxy = async (name, symbol, decimals, token, chain) => deployContract('ERC20Proxy', [name, symbol, decimals, token, chain])
export const BlsVerifier = async () => deployContract('BlsVerifier', [])
export const Vault = async (chain, publicKey, verifier) => {
  if (!verifier) verifier = await BlsVerifier()
  return deployContract('Vault', [chain, 'ETHER', 'ETH', 18, publicKey], {libraries: {BlsVerifier: verifier.target}})
}
