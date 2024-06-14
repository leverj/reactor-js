import {Interface} from 'ethers'
//Contract Object will have Address, Provider, ABI, Topic
export default class Withdraw{
    constructor(withdrawContract, verifierContract){
        this.withdrawContract = withdrawContract
        this.verifierContract = verifierContract
    }
    async consume(withdrawLog){
        const parsedLog = new Interface(this.withdrawContract.abi).parseLog(withdrawLog)
        console.log("Withdraw consume log", parsedLog)
    }
}