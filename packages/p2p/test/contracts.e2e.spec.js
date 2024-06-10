import { setTimeout } from 'timers/promises'
import { expect } from 'expect'
import axios from 'axios'
import { deployContract, getSigners} from './help/index.js'
import {tryAgainIfConnectionError, waitToSync} from '../src/utils.js'
import { createApiNodes, createFrom, createInfo_json, deleteInfoDir, getInfo, getPublicKey, getWhitelists, killChildProcesses, publishWhitelist, startDkg, stop, waitForWhitelistSync } from './help/e2e.js'

describe('blsVerify', () => {
    let contract, L1DepositContract, owner, anyone
    beforeEach(async () => {
        [owner, anyone] = await getSigners()
        contract = await deployContract('BlsVerify', [])
        L1DepositContract = await deployContract('L1Deposit', [])
    })
    afterEach(killChildProcesses)
    it.skip('deposit on L1 and listen on emitted event', async function () {
        console.log("L1DepositContract.address", L1DepositContract.address)
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