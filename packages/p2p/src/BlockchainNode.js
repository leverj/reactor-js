import {ethers, Contract} from 'ethers';
import BridgeNode from './BridgeNode.js';
//FIXME import {abi} does not work "SyntaxError: The requested module does not provide an export named 'abi'"
import abi from '../artifacts/contracts/L1Deposit.sol/L1Deposit.json' assert { type: "json" };

export default class BlockchainNode extends BridgeNode {
    constructor({ip = '0.0.0.0', port = 0, isLeader = false, json, providerUrl, contractAddress}) {
        super({ip, port, isLeader, json})
        this.providerUrl = providerUrl
        this.provider = new ethers.providers.JsonRpcProvider(this.providerUrl)
        this.contract = new Contract(contractAddress, abi.abi, this.provider)
    }
    async create() {
        await super.create()
        if (this.isLeader){
            console.log("BlockchainNode", await this.contract.address)
            const test = await this.contract.test(1,2)
            console.log("test", test)
            //console.log("Setting listener on contract", this.provider, this.contract)
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