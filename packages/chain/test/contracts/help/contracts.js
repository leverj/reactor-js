import {deployContract} from '@leverj/chain-deployment/test'

export const ERC20 = async (name = 'Crap', symbol = 'CRAP') => deployContract('ERC20Mock', [name, symbol])
export const ERC20Proxy = async (chain, token, name, symbol, decimals) => deployContract('ERC20Proxy', [chain, token, name, symbol, decimals])
export const BnsVerifier = async () => {
  const verifier = await deployContract('BnsVerifier', [])
  return deployContract('BnsVerifierMock', [], {libraries: {BnsVerifier: verifier.target}})
}
export const Vault = async (chainId, publicKey, chainName = 'ETHER', nativeSymbol = 'ETH', nativeDecimals = 18) => {
  const verifier = await deployContract('BnsVerifier', [])
  return deployContract('Vault', [chainId, chainName, nativeSymbol, nativeDecimals, publicKey], {libraries: {BnsVerifier: verifier.target}})
}
