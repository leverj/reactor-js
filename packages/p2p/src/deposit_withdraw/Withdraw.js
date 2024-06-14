
//Contract Object will have Address, Provider, ABI, Topic
export default class Withdraw{
    constructor(withdrawContract, verifierContract){
        this.withdrawContract = withdrawContract
        this.verifierContract = verifierContract
    }
    async consume(withdrawData){
        
    }
}