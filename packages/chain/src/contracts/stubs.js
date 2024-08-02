import {Contract} from 'ethers'
import * as abi from './abi/index.js'

export const BlsVerifier = (address, signer) => new Contract(address, abi.BlsVerifier.abi, signer)
export const Vault = (address, signer) => new Contract(address, abi.Vault.abi, signer)