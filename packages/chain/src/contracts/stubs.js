import {Contract} from 'ethers'
import * as abi from './abi/index.js'

export const Vault = (address, signer) => new Contract(address, abi.Vault.abi, signer)