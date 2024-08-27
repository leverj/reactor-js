import {deployContract} from './hardhat.js'

export const ERC20 = async (name = "Crap", symbol = "CRAP") => deployContract('ERC20Mock', [name, symbol])
export const ERC20Proxy = async (chain, token, name, symbol, decimals) => deployContract('ERC20Proxy', [chain, token, name, symbol, decimals])
export const ERC721 = async (name = 'Crap', symbol = 'CRAP') => deployContract('ERC721Mock', [name, symbol])
export const ERC1155 = async (label = 'Crap') => deployContract('ERC1155Mock', [`ipfs://${keccak256(label)}`])
export const BnsVerifier = async () => {
  const verifier = await deployContract('BnsVerifier', [])
  return deployContract('BnsVerifierMock', [], {libraries: {BnsVerifier: verifier.target}})
}
export const Vault = async (chain, publicKey) => {
  const verifier = await deployContract('BnsVerifier', [])
  return deployContract('Vault', [chain, 'ETHER', 'ETH', 18, publicKey], {libraries: {BnsVerifier: verifier.target}})
}
