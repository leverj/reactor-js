import {Interface} from 'ethers'
//Contract Object will have Address, Provider, ABI, Topic
export default class Deposit{
    constructor(depositContract, verifierContract){
        this.depositContract = depositContract
        this.verifierContract = verifierContract
    }
    async consume(depositLog){
        const parsedLog = new Interface(this.depositContract.abi).parseLog(depositLog)
        console.log("Deposit consume log", parsedLog)
    }
}