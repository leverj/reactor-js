import Node from './Node.js'

class BlockchainNode extends Node{
    constructor({ip = '0.0.0.0', port = 0, isLeader = false, peerIdJson, networkProvider, contract, events}) {
        super({ip, port, isLeader, peerIdJson})
        this.networkProvider = networkProvider
        this.contract = contract
        this.events = events
    }
    async start(){
        super.start()
        //set up listener for blockchain events, like Deposit, Withdraw etc
    }
    async subscribeToContractEvent(event){

    }
    //child nodes will typically call this, with some delay (Num Blocks)
    async fetchContractLog(contractHash, delayBlocks){

    }
}
export default BlockchainNode