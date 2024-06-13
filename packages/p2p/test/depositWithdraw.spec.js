import { setTimeout } from 'timers/promises'
import { expect } from 'expect'
import { getSigners} from './help/index.js'
import {createChain, createComponent, createNodes, stop} from './help/depositWithdraw.js'

describe('contract e2e', () => {
    let l1,l2, owner, anyone
    beforeEach(async () => {
        [owner, anyone] = await getSigners();
        console.log('#'.repeat(50),owner.address, anyone.address)
        const chain = await createChain()
        l1 = chain.l1
        l2 = chain.l2
    })
    afterEach(stop)
    it.skip('deposit on L1 and listen on emitted event', async function () {
        const component = await createComponent({l1, l2})
        const tx = await l1.contract.connect(owner).deposit(20)
        const receipt = await tx.wait()
        await setTimeout(1000)
        //console.log("receipt", receipt)
        // await setTimeout(1000)
        // await nodes[0].fetchLogs(0, 10, ["0xc6d85822d86b60b41984292074ead1b48e583535e9e12c2098fe3f6b04a56444"])
        // await setTimeout(5000)
        /*for (const event of receipt.events) {
            if (event.event !== 'L1DepositByUser') continue;
            const message = JSON.stringify(event.args)
            const txnHash = event.transactionHash
            await axios.post('http://127.0.0.1:9000/api/tss/aggregateSign', { txnHash, 'msg': message })
            const fn = async () => {
                const { data: { verified } } = await axios.get('http://127.0.0.1:9000/api/tss/aggregateSign?txnHash=' + txnHash)
                return verified
            }
            await waitToSync([fn], 200)
            const { data: { verified } } = await axios.get('http://127.0.0.1:9000/api/tss/aggregateSign?txnHash=' + txnHash)
            expect(verified).toEqual(true)

        }*/

    })

})