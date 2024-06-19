import vaultAbi from '../abi/Vault.json' assert {type: 'json'}
import { Interface } from 'ethers'
import { buffersToHex, keccak256, toBuffer, uint } from '@leverj/gluon-plasma.common/src/utils/ethereum.js'
import {setTimeout} from 'timers/promises'
import bls from '../utils/bls.js'

export default class Deposit {
    constructor(provider, bridgeNode){
        this.provider = provider
        this.bridgeNode = bridgeNode
        this.contracts = {}
    }
    setContract(chainId, contract){
        this.contracts[chainId] = contract
    }
    async processDepositLog(chainId, depositLog){
        if (this.bridgeNode.isLeader !== true) return;
        const parsedLog = new Interface(vaultAbi.abi).parseLog(depositLog)
        const hashOffChain = keccak256(parsedLog.args[0], parsedLog.args[1], BigInt(parsedLog.args[2]).toString(), BigInt(parsedLog.args[3]).toString(), BigInt(parsedLog.args[4]).toString())
        const isDeposited = await this.contracts[chainId].deposited(hashOffChain)
        if (isDeposited === false) return; 
        await this.bridgeNode.aggregateSignature(depositLog.transactionHash, hashOffChain)
        await setTimeout(1000)
        const aggregateSignature = this.bridgeNode.getAggregateSignature(depositLog.transactionHash)
        console.log('aggregatesign', aggregateSignature)
        if (aggregateSignature.verified === true){
            const targetContract = this.contracts[parsedLog.args[2]]
            //let sig_ser = bls.g1ToBN(aggregateSignature)
            //return await targetContract.mint(sig_ser, pubkey_ser, messageString, parsedLog.args[0], parsedLog.args[1], BigInt(parsedLog.args[2]), BigInt(parsedLog.args[3]), BigInt(parsedLog.args[4]))    
        }
        return aggregateSignature.verified
    }
    async verifyDepositHash(chainId, data){
        console.log("verifyDepositHash", chainId, this.contracts)
        return await this.contracts[chainId].deposited(data.message)
    }
}