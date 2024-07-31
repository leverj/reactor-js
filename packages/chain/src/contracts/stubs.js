import {Contract} from 'ethers'
import * as abi from './abi/index.js'

export const BlsVerify = (address, signer) => new Contract(address, abi.BlsVerify.abi, signer)
export const Vault = (address, signer) => new Contract(address, abi.Vault.abi, signer)