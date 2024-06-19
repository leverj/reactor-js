import vaultAbi from '../abi/Vault.json' assert {type: 'json'}
import { Interface } from 'ethers'
import { buffersToHex, keccak256, toBuffer, uint } from '@leverj/gluon-plasma.common/src/utils/ethereum.js'
import {setTimeout} from 'timers/promises'
import bls from '../utils/bls.js'

export default class Deposit {
    constructor(bridgeNode){
        this.bridgeNode = bridgeNode
        this.contracts = {}
    }
    setContract(chainId, contract){
        this.contracts[chainId] = contract
    }
    async processDepositLog(chainId, depositLog){
        if (this.bridgeNode.isLeader !== true) return;
        const parsedLog = new Interface(vaultAbi.abi).parseLog(depositLog)
        //fixme: name the arguments
        const hashOffChain = keccak256(parsedLog.args[0], parsedLog.args[1], BigInt(parsedLog.args[2]).toString(), BigInt(parsedLog.args[3]).toString(), BigInt(parsedLog.args[4]).toString())
        const isDeposited = await this.contracts[chainId].deposited(hashOffChain)
        if (isDeposited === false) return;
        //fixme: let txHash be depositHash (hashOffChain)
        await this.bridgeNode.aggregateSignature(depositLog.transactionHash, hashOffChain, chainId, 'DEPOSIT')
        await setTimeout(1000)
        const aggregateSignature = this.bridgeNode.getAggregateSignature(depositLog.transactionHash)
        if (aggregateSignature.verified === true){
            const signature = bls.deserializeHexStrToG1(aggregateSignature.groupSign)
            const sig_ser = bls.g1ToBN(signature)
            const pubkeyHex = this.bridgeNode.tssNode.groupPublicKey.serializeToHexStr()
            const pubkey = bls.deserializeHexStrToG2(pubkeyHex)
            const pubkey_ser = bls.g2ToBN(pubkey)  
            const targetContract = this.contracts[parsedLog.args[2]]
            return await targetContract.mint(sig_ser, pubkey_ser, hashOffChain, parsedLog.args[0], parsedLog.args[1], BigInt(parsedLog.args[2]), BigInt(parsedLog.args[3]), BigInt(parsedLog.args[4]))    
        }
        return false
    }
    async verifyDepositHash(chainId, depositHash){
        if (chainId === -1) return true; //for local e2e testing, which wont have any contracts or hardhat, till we expand the scope of e2e
        return await this.contracts[chainId].deposited(depositHash)
    }
}