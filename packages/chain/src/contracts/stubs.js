import {Contract} from 'ethers'
import * as abi from './abi/index.js'

export const BnsVerifier = (address, signer) => new Contract(address, abi.BnsVerifier.abi, signer)
export const Vault = (address, signer) => new Contract(address, abi.Vault.abi, signer)