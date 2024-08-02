import * as chain from '@leverj/reactor.chain/contracts'
import {deserializeHexStrToG1, deserializeHexStrToG2, g1ToBN, g2ToBN} from '@leverj/reactor.mcl'
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
    const [chain, token, name, symbol, decimals, amount, vaultUser, fromChain, toChain, sendCounter] = parsedLog.args
    const sentHash = keccak256(AbiCoder.defaultAbiCoder().encode(
      ['uint', 'address', 'uint', 'uint', 'address', 'uint', 'uint', 'uint'],
      [chain, token, decimals, amount, vaultUser, fromChain, toChain, sendCounter]
    ))
    const isSent = await this.contracts[fromChain].tokenSent(sentHash)
    if (isSent === false) return
    await this.bridgeNode.aggregateSignature(sentHash, sentHash, fromChain, this.sentPayloadVerified.bind(this, chain, token, name, symbol, decimals, amount, vaultUser, fromChain, toChain, sendCounter))
    return sentHash
  }

  async sentPayloadVerified(chain, token, name, symbol, decimals, amount, vaultUser, fromChain, toChain, sendCounter, aggregateSignature) {
    if (aggregateSignature.verified !== true) return
    const signature = deserializeHexStrToG1(aggregateSignature.groupSign)
    const sig_ser = g1ToBN(signature)
    const pubkeyHex = this.bridgeNode.tssNode.groupPublicKey.serializeToHexStr()
    const pubkey = deserializeHexStrToG2(pubkeyHex)
    const pubkey_ser = g2ToBN(pubkey)
    const targetContract = this.contracts[toChain]
    await targetContract.tokenArrival(sig_ser, pubkey_ser, abi.encode(
      ['uint', 'address', 'uint', 'uint', 'address', 'uint', 'uint', 'uint'],
      [BigInt(chain), token, BigInt(decimals), BigInt(amount), vaultUser, BigInt(fromChain), BigInt(toChain), BigInt(sendCounter)]
    ), name, symbol).then(tx => tx.wait())
  }

  async verifySentHash(chain, sentHash) {
    if (chain === -1) return true //for local e2e testing, which wont have any contracts or hardhat, till we expand the scope of e2e
    return await this.contracts[chain].tokenSent(sentHash)
  }
}
