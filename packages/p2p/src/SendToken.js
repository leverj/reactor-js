import * as chain from '@leverj/reactor.chain/contracts'
import {deserializeHexStrToG1, deserializeHexStrToG2, g1ToBN, g2ToBN} from '@leverj/reactor.mcl/mcl'
import {AbiCoder, Interface, keccak256} from 'ethers'

const abi = AbiCoder.defaultAbiCoder()
const iface = new Interface(chain.abi.Vault.abi)

export class SendToken {
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
    const signature = deserializeHexStrToG1(aggregateSignature.groupSign)
    const sig_ser = g1ToBN(signature)
    const pubkeyHex = this.bridgeNode.tssNode.groupPublicKey.serializeToHexStr()
    const pubkey = deserializeHexStrToG2(pubkeyHex)
    const pubkey_ser = g2ToBN(pubkey)
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
