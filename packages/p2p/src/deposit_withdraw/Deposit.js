import { affirm, logger } from '@leverj/common/utils'
import { buffersToHex, keccak256, toBuffer, uint } from '@leverj/gluon-plasma.common/src/utils/ethereum.js'
import bls from '../utils/bls.js'

export default class Deposit {
    constructor(bridgeNode) {
        this.bridgeNode = bridgeNode
        this.contracts = {}
    }
    setContract(chainId, contract) {
        this.contracts[chainId] = contract
    }
    async processDeposit(chainId, depositor, tokenAddress, decimals, toChainId, amount, depositCounter) {
        if (this.bridgeNode.isLeader !== true) return;
        const depositHash = keccak256(depositor, tokenAddress, BigInt(decimals).toString(), BigInt(toChainId).toString(), BigInt(amount).toString(), BigInt(depositCounter).toString())
        const isDeposited = await this.contracts[chainId].deposits(depositHash)
        if (isDeposited === false) return;
        await this.bridgeNode.aggregateSignature(depositHash, depositHash, chainId, 'DEPOSIT', this.signatureVerified.bind(this, depositor, tokenAddress, decimals, toChainId, amount, depositCounter))
    }
    async signatureVerified(depositor, tokenAddress, decimals, toChainId, amount, depositCounter, aggregateSignature) {
        if (aggregateSignature.verified !== true) return
        const signature = bls.deserializeHexStrToG1(aggregateSignature.groupSign)
        const sig_ser = bls.g1ToBN(signature)
        const pubkeyHex = this.bridgeNode.tssNode.groupPublicKey.serializeToHexStr()
        const pubkey = bls.deserializeHexStrToG2(pubkeyHex)
        const pubkey_ser = bls.g2ToBN(pubkey)
        const targetContract = this.contracts[toChainId]
        await targetContract.mint(sig_ser, pubkey_ser, depositor, tokenAddress, BigInt(decimals), BigInt(toChainId), BigInt(amount), BigInt(depositCounter))

    }
    async verifyDepositHash(chainId, depositHash) {
        if (chainId === -1) return true; //for local e2e testing, which wont have any contracts or hardhat, till we expand the scope of e2e
        return await this.contracts[chainId].deposits(depositHash)
    }
}