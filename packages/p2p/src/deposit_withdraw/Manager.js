import Deposit from './Deposit.js'
import Withdraw from './Withdraw.js'
import { Tracker } from './Tracker.js'
//Create Deposit/Withdraw chain pairs. Every deposit or withdraw tracking happens in pairs. Listen on one chian, verify on other
export default class Manager{

    //This is our immediate use case, so specific function for now, for clarity
    async createL1andL2(L1Info, L2Info){
        const deposit = new Deposit(L1Info.depositContract, L2Info.depositVerifierContract)
        const withdraw = new Withdraw(L2Info.withdrawContract, L1Info.withdrawVerifierContract)

        const depositEventsTracker = new Tracker(L1Info.provider, L1Info.chainId, [L1Info.depositTopic])
        const withdrawEventsTracker = new Tracker(L2Info.provider, L2Info.chainId, [L2Info.withdrawTopic])

        depositEventsTracker.addConsumer(deposit, L1Info.depositTopic)
        withdrawEventsTracker.addConsumer(withdraw, L2Info.withdrawTopic)

        await depositEventsTracker.start()
        await withdrawEventsTracker.start()
    }
}