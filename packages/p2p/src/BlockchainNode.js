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
        this.contractAddress = contractAddress
        this.contract = new Contract(contractAddress, abi.abi, this.provider)
    }
    //import config from '@leverj/gallery.config/chain-tracking-server'
    //const {polling} = config
    /*const polling = {
        interval: {
          format: 'nat',
          default: 15  * 1000,
          env: 'POLLING_INTERVAL',
        },
        attempts: {
          format: 'nat',
          default: 5,
          env: 'POLLING_ATTEMPTS',
        },
      }*/
    async create() {
        await super.create()
        /*if (this.isLeader){
            const filter = {
                address: this.contractAddress,
                topics: ["0xc6d85822d86b60b41984292074ead1b48e583535e9e12c2098fe3f6b04a56444"]
            }
            this.provider.on(filter, (data) => {
                console.log("topic listener", data)
            })
        }*/
    }
    //Leader function
    async fetchLogs(fromBlock, toBlock, topics){
        const filter = {fromBlock, toBlock, topics}
        console.log("fetchLogs", filter)
        let logs
        try {
            logs = await this.provider.getLogs(filter).then(_ => _.filter(_ => !_.removed))
        } catch (e) {
            console.log("exception in fetch logs", e)
        }
        for (const log of logs){
            const businessData = this.contract.interface.parseLog(log)
            console.log("fetch data for hash", log.transactionHash, businessData)
            await this.aggregateSignature(log.transactionHash, businessData)
        }
    }
    //Child nodes function. But these need to be in BridgeNode, since child signature function is there
    async fetchLogsForHash(transactionHash){
        const tx = await this.provider.getTransactionReceipt(transactionHash)
        const businessData = tx.logs.map((log) => this.contract.interface.parseLog(log))
        console.log(businessData)
    }
    async getLatestBlock(){
        return await this.provider.getBlockNumber()
    }
}