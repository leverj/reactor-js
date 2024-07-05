import {affirm, logger} from '@leverj/common/utils'
import {AbiCoder } from 'ethers'
// import {soliditySha3 as keccak256} from 'web3-utils'
import {keccak256} from '@leverj/gluon-plasma.common/src/utils/ethereum.js'
import bls from '../utils/bls.js'
import vaultAbi from '../abi/Vault.json' assert {type: 'json'}
import {Interface} from 'ethers'

const abi = AbiCoder.defaultAbiCoder()
//fixme this class can be renamed to something more appropriate ? like SendToken ?
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
  async processTokenSent(log) {
    if (this.bridgeNode.isLeader !== true) return
    const parsedLog = new Interface(vaultAbi.abi).parseLog(log)
    const [originatingChain, originatingToken, decimals, amount, vaultUser, fromChainId, toChainId, sendCounter] = parsedLog.args
    const sentHash = keccak256(BigInt(originatingChain).toString(), originatingToken, BigInt(decimals).toString(), BigInt(amount).toString(), vaultUser, BigInt(fromChainId).toString(), BigInt(toChainId).toString(), BigInt(sendCounter).toString())
    const isSent = await this.contracts[fromChainId].tokenSent(sentHash)
    if (isSent === false) return
    await this.bridgeNode.aggregateSignature(sentHash, sentHash, fromChainId, this.signatureVerified.bind(this, originatingChain, originatingToken, decimals, amount, vaultUser, fromChainId, toChainId, sendCounter))
    return sentHash
  }
  
  //fixme - how is the name derived. If address is 0x0 then Wrapper_ETH, W_ETH can be name/symbol ? For other token address get it from 
  //its ERC-20 contract and suffix with _PROXY ?
  async getNameAndSymbol(tokenAddress){
    return {
        name: 'PROXY_NAME',
        symbol: 'PRX'
    }
  }
  async signatureVerified(originatingChain, originatingToken, decimals, amount, vaultUser, fromChainId, toChainId, sendCounter, aggregateSignature) {
    if (aggregateSignature.verified !== true) return
    const signature = bls.deserializeHexStrToG1(aggregateSignature.groupSign)
    const sig_ser = bls.g1ToBN(signature)
    const pubkeyHex = this.bridgeNode.tssNode.groupPublicKey.serializeToHexStr()
    const pubkey = bls.deserializeHexStrToG2(pubkeyHex)
    const pubkey_ser = bls.g2ToBN(pubkey)
    const targetContract = this.contracts[toChainId]
    const {name, symbol} = await this.getNameAndSymbol(originatingToken)
    await targetContract.tokenArrival(sig_ser, pubkey_ser, abi.encode(['uint','address','uint','uint','address','uint','uint','uint'], [BigInt(originatingChain), originatingToken, BigInt(decimals),  BigInt(amount), vaultUser, BigInt(fromChainId),BigInt(toChainId),BigInt(sendCounter)])).then(tx => tx.wait())
  }

  async verifySentHash(chainId, sentHash) {
    if (chainId === -1) return true //for local e2e testing, which wont have any contracts or hardhat, till we expand the scope of e2e
    return await this.contracts[chainId].tokenSent(sentHash) 
  }
  async verifyWithdrawHash(chainId, withdrawalHash) {
    if (chainId === -1) return true //for local e2e testing, which wont have any contracts or hardhat, till we expand the scope of e2e
    return await this.contracts[chainId].withdrawals(withdrawalHash) 
  }
}