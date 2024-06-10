import { setTimeout } from 'timers/promises'
import { expect } from 'expect'
import { getSigners} from './help/index.js'
import {createContracts, createNodes, stop} from './help/contracts.e2e.js'

describe('contract e2e', () => {
    let depositContract, owner, anyone
    beforeEach(async () => {
        [owner, anyone] = await getSigners();
        [depositContract] =await createContracts()
    })
    afterEach(stop)
    it('deposit on L1 and listen on emitted event', async function () {
        const nodes = await createNodes(4, owner.provider, depositContract.address)
        return
        await L1DepositContract.test(1, 2).then(console.log)
        const allNodes = [9000, 9001, 9002, 9003]
        await createInfo_json(allNodes.length)

        await createApiNodes(allNodes.length)
        await setTimeout(1000)

        const tx = await L1DepositContract.deposit(20)
        const receipt = await tx.wait()
        await setTimeout(1000)

        
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