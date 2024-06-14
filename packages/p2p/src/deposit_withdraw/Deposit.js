
//Contract Object will have Address, Provider, ABI, Topic
export default class Deposit{
    constructor(depositContract, verifierContract){
        this.depositContract = depositContract
        this.verifierContract = verifierContract
    }
    async consume(depositData){
        
    }
}