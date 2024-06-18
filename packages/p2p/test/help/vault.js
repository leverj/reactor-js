import {deployContract, getSigners} from './hardhat.cjs'
export {provider} from './hardhat.cjs'

export const [owner, account1, account2, account3, account4, account5, account6, account7, account8, account9] = await getSigners()
export const createVault = async (pubkey_ser) => await deployContract('Vault', [pubkey_ser])



