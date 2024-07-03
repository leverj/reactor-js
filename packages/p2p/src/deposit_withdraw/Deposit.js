import {affirm, logger} from '@leverj/common/utils'
import {AbiCoder } from 'ethers'
// import {soliditySha3 as keccak256} from 'web3-utils'
import {keccak256} from '@leverj/gluon-plasma.common/src/utils/ethereum.js'
import bls from '../utils/bls.js'
import vaultAbi from '../abi/Vault.json' assert {type: 'json'}
import {Interface} from 'ethers'

const abi = AbiCoder.defaultAbiCoder()

export default class Deposit {
  constructor(bridgeNode) {
    this.bridgeNode = bridgeNode
    this.contracts = {}
  }

  setContract(chainId, contract) {
    this.contracts[chainId] = contract
  }

  getEventParameterTypesAndNames(eventAbi) {
    return eventAbi.inputs.map(input => `${input.type} ${input.name}`)
  }

  //fixme could not find any "native" or default way to extract event log's column names and types, so lil bit of manual js work
  async processDeposit(chainId, log) {
    if (this.bridgeNode.isLeader !== true) return
    const parsedLog = new Interface(vaultAbi.abi).parseLog(log)
    const [depositor, originatingChain, originatingToken, decimals, toChainId, amount, depositCounter] = parsedLog.args
    const depositHash = keccak256(depositor, BigInt(originatingChain).toString(), originatingToken, BigInt(decimals).toString(), BigInt(toChainId).toString(), BigInt(amount).toString(), BigInt(depositCounter).toString())
    const isDeposited = await this.contracts[chainId].deposits(depositHash)
    if (isDeposited === false) return
    await this.bridgeNode.aggregateSignature(depositHash, depositHash, chainId, 'DEPOSIT', this.signatureVerified.bind(this, true, depositor, originatingChain, originatingToken, decimals, chainId, toChainId, amount, depositCounter))
    return depositHash
  }
  async processWithdraw(chainId, log) {
    if (this.bridgeNode.isLeader !== true) return
    const parsedLog = new Interface(vaultAbi.abi).parseLog(log)
    const [depositor, originatingChain, originatingToken, decimals, toChainId, amount, depositCounter] = parsedLog.args
    console.log({
        depositor, originatingChain, originatingToken, decimals, toChainId, amount, depositCounter
    })
    const withdrawHash = keccak256(depositor, BigInt(originatingChain).toString(), originatingToken, BigInt(decimals).toString(), BigInt(toChainId).toString(), BigInt(amount).toString(), BigInt(depositCounter).toString())
    const isWithdrawn = await this.contracts[chainId].withdrawals(withdrawHash)
    console.log("isWithdrawn", withdrawHash, isWithdrawn)
    if (isWithdrawn === false) return
    await this.bridgeNode.aggregateSignature(withdrawHash, withdrawHash, chainId, 'WITHDRAW', this.signatureVerified.bind(this, false, depositor, originatingChain, originatingToken, decimals, chainId, toChainId, amount, depositCounter))
    return withdrawHash

  }
  //fixme - how is the name derived. If address is 0x0 then Wrapper_ETH, W_ETH can be name/symbol ? For other token address get it from 
  //its ERC-20 contract and suffix with _PROXY ?
  async getNameAndSymbol(tokenAddress){
    return {
        name: 'PROXY_NAME',
        symbol: 'PRX'
    }
  }
  async signatureVerified(isDeposit, depositor, originatingChain, originatingToken, decimals, chainId, toChainId, amount, depositCounter, aggregateSignature) {
    console.log('signatureVerified')
    console.log({
        isDeposit, depositor, originatingChain, originatingToken, decimals, chainId, toChainId, amount, depositCounter, aggregateSignature
    })
    if (aggregateSignature.verified !== true) return
    const signature = bls.deserializeHexStrToG1(aggregateSignature.groupSign)
    const sig_ser = bls.g1ToBN(signature)
    const pubkeyHex = this.bridgeNode.tssNode.groupPublicKey.serializeToHexStr()
    const pubkey = bls.deserializeHexStrToG2(pubkeyHex)
    const pubkey_ser = bls.g2ToBN(pubkey)
    console.log("To Chain ID", toChainId)
    const targetContract = this.contracts[toChainId]
    const targetChainId = await targetContract.chainId();
    console.log("Chain ID inside contract", targetChainId)
    console.log("Originating chain", originatingChain)
    const {name, symbol} = await this.getNameAndSymbol(originatingToken)
    isDeposit ?
    await targetContract.mint(sig_ser, pubkey_ser, abi.encode(['address', 'uint', 'address', 'uint', 'uint', 'uint', 'uint', 'string', 'string'], [depositor, BigInt(originatingChain), originatingToken, BigInt(decimals), BigInt(toChainId), BigInt(amount), BigInt(depositCounter), name, symbol])).then(tx => tx.wait())
    :
    await targetContract.disburse(sig_ser, pubkey_ser, abi.encode(['address', 'uint', 'address', 'uint', 'uint', 'uint', 'uint', 'string', 'string'], [depositor, BigInt(originatingChain), originatingToken, BigInt(decimals), BigInt(toChainId), BigInt(amount), BigInt(depositCounter), name, symbol])).then(tx => tx.wait())
    
  }

  async verifyDepositHash(chainId, depositHash) {
    if (chainId === -1) return true //for local e2e testing, which wont have any contracts or hardhat, till we expand the scope of e2e
    return await this.contracts[chainId].deposits(depositHash) 
  }
  async verifyWithdrawHash(chainId, withdrawalHash) {
    if (chainId === -1) return true //for local e2e testing, which wont have any contracts or hardhat, till we expand the scope of e2e
    return await this.contracts[chainId].withdrawals(withdrawalHash) 
  }
}