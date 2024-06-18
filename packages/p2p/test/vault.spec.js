import {expect} from 'expect'
import {createVault, provider} from './help/vault.js'
import {Interface} from 'ethers'
import vaultAbi from '../src/abi/Vault.json' assert {type: 'json'}
import {buffersToHex, keccak256, toBuffer, uint} from '@leverj/gluon-plasma.common/src/utils/ethereum.js'
describe('vault contract', function () {

  it.only('should be able to deposit ether', async function () {
    const contract = await createVault()
    const amount = BigInt(1e+6)
    const toChain  = 10101
    const txnReceipt = await contract.depositEth(toChain, {value: amount})
    const logs = await provider.getLogs(txnReceipt)
    for (const log of logs){
      const parsedLog = new Interface(vaultAbi.abi).parseLog(log)
      let isDeposited = await contract.isDeposited(parsedLog.args[0], parsedLog.args[1], BigInt(parsedLog.args[2]), BigInt(parsedLog.args[3]), BigInt(parsedLog.args[4]))
      expect(isDeposited).toEqual(true)
      //Changing even one data point should fail
      isDeposited = await contract.isDeposited(parsedLog.args[1], parsedLog.args[0], BigInt(parsedLog.args[2]), BigInt(parsedLog.args[3]), BigInt(parsedLog.args[4]))
      expect(isDeposited).toEqual(false)
      isDeposited = await contract.isDeposited(parsedLog.args[0], parsedLog.args[1], BigInt(parsedLog.args[2]), BigInt(parsedLog.args[4]), BigInt(parsedLog.args[3]))
      expect(isDeposited).toEqual(false)
      //Compute hash off-chain and check deposit status
      const hashOffChain = keccak256(parsedLog.args[0], parsedLog.args[1], BigInt(parsedLog.args[2]).toString(), BigInt(parsedLog.args[3]).toString(), BigInt(parsedLog.args[4]).toString())
      isDeposited = await contract.deposited(hashOffChain)
      expect(isDeposited).toEqual(true)
    }
    expect(await provider.getBalance(await contract.getAddress())).toEqual(amount)
  })
})