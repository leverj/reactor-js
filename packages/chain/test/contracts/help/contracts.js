import {deployContract} from './hardhat.js'

export const ERC20 = async () => deployContract('ERC20Mock')
export const ERC20Proxy = async (chain, token, name, symbol, decimals) => deployContract('ERC20Proxy', [chain, token, name, symbol, decimals])
export const BnsVerifier = async () => {
  const verifier = await deployContract('BnsVerifier', [])
  return deployContract('BnsVerifierMock', [], {libraries: {BnsVerifier: verifier.target}})
}
export const Vault = async (chain, publicKey) => {
  const verifier = await deployContract('BnsVerifier', [])
  return deployContract('Vault', [chain, 'ETHER', 'ETH', 18, publicKey], {libraries: {BnsVerifier: verifier.target}})
}
