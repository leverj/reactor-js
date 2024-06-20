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
        const depositor = parsedLog.args[0]
        const tokenAddress = parsedLog.args[1]
        const toChainId = parsedLog.args[2]
        const amount = parsedLog.args[3]
        const depositCounter = parsedLog.args[4]
        const depositHash = keccak256(depositor, tokenAddress, BigInt(toChainId).toString(), BigInt(amount).toString(), BigInt(depositCounter).toString())
        const isDeposited = await this.contracts[chainId].deposits(depositHash)
        if (isDeposited === false) return;
        await this.bridgeNode.aggregateSignature(depositHash, depositHash, chainId, 'DEPOSIT', this.signatureVerified.bind(this, depositor, tokenAddress, toChainId, amount, depositCounter))
        await setTimeout(1000)
        
    }
    async signatureVerified(depositor, tokenAddress, toChainId, amount, depositCounter, aggregateSignature){
        if (aggregateSignature.verified === true){
            const signature = bls.deserializeHexStrToG1(aggregateSignature.groupSign)
            const sig_ser = bls.g1ToBN(signature)
            const pubkeyHex = this.bridgeNode.tssNode.groupPublicKey.serializeToHexStr()
            const pubkey = bls.deserializeHexStrToG2(pubkeyHex)
            const pubkey_ser = bls.g2ToBN(pubkey)  
            const targetContract = this.contracts[toChainId]
            const verified = await targetContract.mint(sig_ser, pubkey_ser, depositor, tokenAddress, BigInt(toChainId), BigInt(amount), BigInt(depositCounter))    
            console.log("Minted by contract", verified)
        }
    }
    async verifyDepositHash(chainId, depositHash){
        if (chainId === -1) return true; //for local e2e testing, which wont have any contracts or hardhat, till we expand the scope of e2e
        return await this.contracts[chainId].deposited(depositHash)
    }
}