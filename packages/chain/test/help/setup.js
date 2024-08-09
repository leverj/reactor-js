import {deployContract} from './hardhat.js'

export const ERC20 = async (name = 'Crap', symbol = 'CRAP') => deployContract('ERC20Mock', [name, symbol])
export const ERC20Proxy = async (name, symbol, decimals, token, chain) => deployContract('ERC20Proxy', [name, symbol, decimals, token, chain])
export const BnsVerifier = async () => {
  const verifier = await deployContract('BnsVerifier', [])
  return deployContract('BnsVerifierMock', [], {libraries: {BnsVerifier: verifier.target}})
}
export const Vault = async (chain, publicKey) => {
  const verifier = await deployContract('BnsVerifier', [])
  return deployContract('Vault', [chain, 'ETHER', 'ETH', 18, publicKey], {libraries: {BnsVerifier: verifier.target}})
}
