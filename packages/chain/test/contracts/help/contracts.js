import {deployContract} from '@leverj/lever.chain-deployment/hardhat.help'

export const ERC20 = async (name = 'Crap', symbol = 'CRAP', signer) => deployContract('ERC20Mock', [name, symbol], signer)
export const ERC20Proxy = async (chain, token, name, symbol, decimals) => deployContract('ERC20Proxy', [chain, token, name, symbol, decimals])
export const BnsVerifier = async () => {
  const verifier = await deployContract('BnsVerifier', [])
  return deployContract('BnsVerifierMock', [], {libraries: {BnsVerifier: verifier.target}})
}
export const Vault = async (chainId, publicKey, signer) => {
  const verifier = await deployContract('BnsVerifier', [])
  const libraries = {BnsVerifier: verifier.target}
  const factoryOptions = Object.assign({libraries}, signer ? {signer} : {})
  return deployContract('Vault', [chainId, 'ETHER', 'ETH', 18, publicKey], factoryOptions)
}
