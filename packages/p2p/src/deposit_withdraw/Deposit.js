import {AbiCoder, Interface, keccak256} from 'ethers'
import * as chain from '@leverj/reactor.chain/contracts'
import {bls} from '../utils/index.js'

const abi = AbiCoder.defaultAbiCoder()
const iface = new Interface(chain.abi.Vault.abi)

//fixme this class can be renamed to something more appropriate ? like SendToken ?
export default class Deposit {
  constructor(bridgeNode) {
    this.bridgeNode = bridgeNode
    this.contracts = {}
  }

  setContract(chainId, contract) { this.contracts[chainId] = contract }

  //fixme could not find any "native" or default way to extract event log's column names and types, so lil bit of manual js work
  async processTokenSent(log) {
    if (this.bridgeNode.isLeader !== true) return
    const parsedLog = iface.parseLog(log)
    const [originatingChain, originatingToken, originatingName, originatingSymbol, decimals, amount, vaultUser, fromChainId, toChainId, sendCounter] = parsedLog.args
    const sentHash = keccak256(AbiCoder.defaultAbiCoder().encode(
      ['uint', 'address', 'uint', 'uint', 'address', 'uint', 'uint', 'uint'],
      [originatingChain, originatingToken, decimals, amount, vaultUser, fromChainId, toChainId, sendCounter]
    ))
    const isSent = await this.contracts[fromChainId].tokenSent(sentHash)
    if (isSent === false) return
    await this.bridgeNode.aggregateSignature(sentHash, sentHash, fromChainId, this.sentPayloadVerified.bind(this, originatingChain, originatingToken, originatingName, originatingSymbol, decimals, amount, vaultUser, fromChainId, toChainId, sendCounter))
    return sentHash
  }

  async sentPayloadVerified(originatingChain, originatingToken, originatingName, originatingSymbol, decimals, amount, vaultUser, fromChainId, toChainId, sendCounter, aggregateSignature) {
    if (aggregateSignature.verified !== true) return
    const signature = bls.deserializeHexStrToG1(aggregateSignature.groupSign)
    const sig_ser = bls.g1ToBN(signature)
    const pubkeyHex = this.bridgeNode.tssNode.groupPublicKey.serializeToHexStr()
    const pubkey = bls.deserializeHexStrToG2(pubkeyHex)
    const pubkey_ser = bls.g2ToBN(pubkey)
    const targetContract = this.contracts[toChainId]
    await targetContract.tokenArrival(sig_ser, pubkey_ser, abi.encode(
      ['uint', 'address', 'uint', 'uint', 'address', 'uint', 'uint', 'uint'],
      [BigInt(originatingChain), originatingToken, BigInt(decimals), BigInt(amount), vaultUser, BigInt(fromChainId), BigInt(toChainId), BigInt(sendCounter)]
    ), originatingName, originatingSymbol).then(tx => tx.wait())
  }

  async verifySentHash(chainId, sentHash) {
    if (chainId === -1) return true //for local e2e testing, which wont have any contracts or hardhat, till we expand the scope of e2e
    return await this.contracts[chainId].tokenSent(sentHash)
  }
}
