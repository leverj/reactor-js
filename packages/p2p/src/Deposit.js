import * as chain from '@leverj/reactor.chain/contracts'
import {deserializeHexStrToPublicKey, deserializeHexStrToSignature, G1ToNumbers, G2ToNumbers} from '@leverj/reactor.mcl'
import {AbiCoder, Interface, keccak256} from 'ethers'

const abi = AbiCoder.defaultAbiCoder()
const iface = new Interface(chain.abi.Vault.abi)

export class Deposit {
  constructor(bridgeNode) {
    this.bridgeNode = bridgeNode
    this.contracts = {}
  }

  setContract(chain, contract) { this.contracts[chain] = contract }

  //fixme: could not find any "native" or default way to extract event log's column names and types, so lil bit of manual js work
  async processTokenSent(log) {
    if (this.bridgeNode.isLeader !== true) return
    const parsedLog = iface.parseLog(log)
    const [chain, token, name, symbol, decimals, amount, owner, fromChain, toChain, sendCounter] = parsedLog.args
    const sentHash = keccak256(AbiCoder.defaultAbiCoder().encode(
      ['uint', 'address', 'uint', 'uint', 'address', 'uint', 'uint', 'uint'],
      [chain, token, decimals, amount, owner, fromChain, toChain, sendCounter]
    ))
    const isSent = await this.contracts[fromChain].tokenSent(sentHash)
    if (isSent === false) return
    await this.bridgeNode.aggregateSignature(sentHash, sentHash, fromChain, this.sentPayloadVerified.bind(this, chain, token, name, symbol, decimals, amount, owner, fromChain, toChain, sendCounter))
    return sentHash
  }

  async sentPayloadVerified(chain, token, name, symbol, decimals, amount, owner, fromChain, toChain, sendCounter, aggregateSignature) {
    if (aggregateSignature.verified !== true) return
    const signature = deserializeHexStrToSignature(aggregateSignature.groupSign)
    const sig_ser = G1ToNumbers(signature)
    const pubkeyHex = this.bridgeNode.tssNode.groupPublicKey.serializeToHexStr()
    const pubkey = deserializeHexStrToPublicKey(pubkeyHex)
    const pubkey_ser = G2ToNumbers(pubkey)
    const targetContract = this.contracts[toChain]
    await targetContract.tokenArrival(sig_ser, pubkey_ser, abi.encode(
      ['uint', 'address', 'uint', 'uint', 'address', 'uint', 'uint', 'uint'],
      [BigInt(chain), token, BigInt(decimals), BigInt(amount), owner, BigInt(fromChain), BigInt(toChain), BigInt(sendCounter)]
    ), name, symbol).then(tx => tx.wait())
  }

  async verifySentHash(chain, sentHash) {
    if (chain === -1) return true //for local e2e testing, which wont have any contracts or hardhat, till we expand the scope of e2e
    return await this.contracts[chain].tokenSent(sentHash)
  }
}
