import {JsonRpcProvider, Contract} from 'ethers';
import BridgeNode from './BridgeNode.js';
//FIXME import {abi} does not work "SyntaxError: The requested module does not provide an export named 'abi'"
import abi from '../artifacts/contracts/L1Deposit.sol/L1Deposit.json' assert { type: "json" };

export default class BlockchainNode extends BridgeNode {
    static create({ip, port, isLeader, json, providerUrl, contractAddress, bootstrapNodes}){
        const provider = new JsonRpcProvider(providerUrl)
        return new BlockchainNode({ip, port, isLeader, json, provider, contractAddress, bootstrapNodes})
    }

    static fromConfiguredEvms({ip, port, isLeader, json, provider, contractAddress, bootstrapNodes}) {
        return new BlockchainNode({ip, port, isLeader, json, provider, contractAddress, bootstrapNodes})
    }

    constructor({ip = '0.0.0.0', port = 0, isLeader = false, json, provider, contractAddress, bootstrapNodes}) {
        super({ip, port, isLeader, json, bootstrapNodes})
        this.provider = provider
        this.contract = new Contract(contractAddress, abi.abi, this.provider)
    }

    async create() {
        await super.create()
        if (this.isLeader){
            const test = await this.contract.test(1,2)
            this.contract.on("L1DepositByUser", (depositor, amount)=>{
                console.log("OnDepositEvent", depositor, amount)
            })
        }
    }
    async fetchLogs(transactionHash){
        const receipt = await this.provider.getTransactionReceipt(transactionHash)
        return receipt
    }
    async getLatestBlock(){
        return await this.provider.getBlockNumber()
    }
}