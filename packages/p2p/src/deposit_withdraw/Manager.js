import Deposit from './Deposit.js'
import Withdraw from './Withdraw.js'
import { Tracker } from './Tracker.js'
//Create Deposit/Withdraw chain pairs. Every deposit or withdraw tracking happens in pairs. Listen on one chian, verify on other
export default class Manager{

    constructor(bridgeNode){
        this.bridgeNode = bridgeNode
    }
    //This is our immediate use case, so specific function for now, for clarity
    async createL1andL2(L1Info, L2Info){
        console.log("createL1andL2")
        const deposit = new Deposit(L1Info.depositContract, L2Info.depositVerifierContract)
        const withdraw = new Withdraw(L2Info.withdrawContract, L1Info.withdrawVerifierContract)

        const depositEventsTracker = new Tracker(L1Info.provider, L1Info.chainId, [L1Info.depositTopic])
        const withdrawEventsTracker = new Tracker(L2Info.provider, L2Info.chainId, [L2Info.withdrawTopic])

        depositEventsTracker.addConsumer(deposit, L1Info.depositTopic)
        withdrawEventsTracker.addConsumer(withdraw, L2Info.withdrawTopic)

        console.log("Created L1, L2 deposit withdraw")
        await depositEventsTracker.start()
        //await withdrawEventsTracker.start()
    }
    //other cases like multichain where Deposit and Withdraw can reside on same chain will be handled similar way
}