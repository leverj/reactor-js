import {setTimeout} from 'timers/promises'
import { expect } from 'expect'
import axios from 'axios'
import { deployContract, getSigners, createDkgMembers, signMessage } from './help/index.js'
import bls from '../src/bls.js'
import * as mcl from '../src/mcl/mcl.js'
import { deserializeHexStrToG1, deserializeHexStrToG2 } from 'mcl-wasm'
import { stringToHex } from '../src/mcl/mcl.js'
import {tryAgainIfConnectionError, waitToSync} from '../src/utils.js'

import { createApiNodes, createFrom, createInfo_json, deleteInfoDir, getInfo, getPublicKey, getWhitelists, killChildProcesses, publishWhitelist, startDkg, stop, waitForWhitelistSync } from './help/e2e.js'


const messageString = 'hello world'
describe('blsVerify', () => {
  let contract, L1DepositContract, owner, anyone
  before(async () => {
    await mcl.init()
  })
  beforeEach(async () => {
    [owner, anyone] = await getSigners()
    contract = await deployContract('BlsVerify', [])
    L1DepositContract = await deployContract('L1Deposit', [])
  })

  it('deposit on L1 and listen on emitted event', async function () {
    const tx = await L1DepositContract.deposit(20)
    const receipt = await tx.wait()
    
    const allNodes = [9000, 9001, 9002, 9003]
    await createInfo_json(allNodes.length)

    await createApiNodes(allNodes.length)
    await setTimeout(1000)
    for (const event of receipt.events) {
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

    }

  })
  it('verify single signature', async function () {
    // mcl.setMappingMode(mcl.MAPPING_MODE_TI)
    // mcl.setDomain('testing evmbls')
    const message = mcl.stringToHex(messageString)
    const { pubkey, secret } = mcl.newKeyPair()
    const { signature, M } = mcl.sign(message, secret)
    let sig_ser = mcl.g1ToBN(signature)
    let pubkey_ser = mcl.g2ToBN(pubkey)
    let message_ser = mcl.g1ToBN(M)

    let res = await contract.verifySignature(sig_ser, pubkey_ser, message_ser)
    expect(res).toEqual(true)
  })

  it('should verify signature from dkgnodes', async function () {
    const threshold = 4
    const members = await createDkgMembers([10314, 30911, 25411, 8608, 31524, 15441, 23399], threshold)
    const { signs, signers } = signMessage(messageString, members)
    const groupsSign = new bls.Signature()
    groupsSign.recover(signs, signers)


    const signatureHex = groupsSign.serializeToHexStr()
    const pubkeyHex = members[0].groupPublicKey.serializeToHexStr()
    const M = mcl.hashToPoint(messageString)

    const signature = deserializeHexStrToG1(signatureHex)
    const pubkey = deserializeHexStrToG2(pubkeyHex)
    let message_ser = mcl.g1ToBN(M)
    let pubkey_ser = mcl.g2ToBN(pubkey)
    let sig_ser = mcl.g1ToBN(signature)
    let res = await contract.verifySignature(sig_ser, pubkey_ser, message_ser)
    expect(res).toEqual(true)
  })

  it('should be able to convert message to point', async function () {
    let res = await contract.hashToPoint(stringToHex('testing evmbls'), stringToHex(messageString))
    let fromJs = mcl.g1ToBN(mcl.hashToPoint(messageString))
    // console.log('from js', fromJs)
    // console.log('from contract', res)
    expect(res).toEqual(fromJs)
  })
})
