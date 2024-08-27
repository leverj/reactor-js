import {deployContract} from './hardhat.js'

export const ERC20 = async (name = 'Crap', symbol = 'CRAP') => deployContract('ERC20Mock', [name, symbol])
export const ERC721 = async (name = 'Crap', symbol = 'CRAP') => deployContract('ERC721Mock', [name, symbol])
export const ERC1155 = async (label = 'Crap') => deployContract('ERC1155Mock', [`ipfs://${keccak256(label)}`])
