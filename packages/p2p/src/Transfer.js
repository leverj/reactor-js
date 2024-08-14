import * as chain from '@leverj/reactor.chain/contracts'
import {deserializeHexStrToPublicKey, deserializeHexStrToSignature, G1ToNumbers, G2ToNumbers} from '@leverj/reactor.mcl'
import {AbiCoder, Interface, keccak256} from 'ethers'

const iface = new Interface(chain.abi.Vault.abi)

export class Transfer {
  constructor(node) {
    this.node = node
    this.contracts = {}
  }

  setContract(chain, contract) { this.contracts[chain] = contract }

  async processTokenSent(log) {
    if (this.node.isLeader !== true) return
    const {originatingChainId, token, name, symbol, decimals, amount, owner, fromChainId, toChainId, sendCounter} = iface.parseLog(log).args
    const sentHash = keccak256(AbiCoder.defaultAbiCoder().encode(
      ['uint', 'address', 'uint', 'uint', 'address', 'uint', 'uint', 'uint'],
      [originatingChainId, token, decimals, amount, owner, fromChainId, toChainId, sendCounter]
    ))
    const isSent = await this.contracts[fromChainId].tokenSent(sentHash)
    if (isSent === false) return
    await this.node.aggregateSignature(sentHash, sentHash, fromChainId, this.sentPayloadVerified.bind(this, originatingChainId, token, name, symbol, decimals, amount, owner, fromChainId, toChainId, sendCounter))
    return sentHash
  }

  async sentPayloadVerified(chain, token, name, symbol, decimals, amount, owner, fromChain, toChain, sendCounter, aggregateSignature) {
    if (aggregateSignature.verified !== true) return
    const signature = deserializeHexStrToSignature(aggregateSignature.groupSign)
    const sig_ser = G1ToNumbers(signature)
    const pubkeyHex = this.node.groupPublicKey.serializeToHexStr()
    const pubkey = deserializeHexStrToPublicKey(pubkeyHex)
    const pubkey_ser = G2ToNumbers(pubkey)
    const targetContract = this.contracts[toChain]
    await targetContract.tokenArrival(sig_ser, pubkey_ser, AbiCoder.defaultAbiCoder().encode(
      ['uint', 'address', 'uint', 'uint', 'address', 'uint', 'uint', 'uint'],
      [BigInt(chain), token, BigInt(decimals), BigInt(amount), owner, BigInt(fromChain), BigInt(toChain), BigInt(sendCounter)]
    ), name, symbol).then(tx => tx.wait())
  }

  async verifySentHash(chain, sentHash) {
    if (chain === -1) return true // note: for local e2e testing, which will not  have any contracts or hardhat, till we expand the scope of e2e
    return this.contracts[chain].tokenSent(sentHash)
  }
}
