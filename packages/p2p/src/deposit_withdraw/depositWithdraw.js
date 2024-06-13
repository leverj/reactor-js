import {JsonRpcProvider, Contract} from 'ethers'
import abi1 from '../abi/L1Vault.json' assert {type: 'json'}
import abi2 from '../abi/L2Vault.json' assert {type: 'json'}
import { Tracker } from './Tracker.js'
import {Marker} from './Marker.js'
class DepositWithdraw {
  static from(bridgeNode, config) {
    const l1 = {
      provider: new JsonRpcProvider(config.depositWithdraw.l1.providerUrl),
      address: config.depositWithdraw.l1.contractAddress
    }
    const l2 = {
      provider: new JsonRpcProvider(config.depositWithdraw.l2.providerUrl),
      address: config.depositWithdraw.l2.contractAddress
    }
    return new DepositWithdraw({bridgeNode, l1, l2})
  }

  constructor({bridgeNode, l1, l2}) {
    this.id = DepositWithdraw.id
    this.bridgeNode = bridgeNode
    this.l1 = l1
    this.l2 = l2
    this.l1.contract = new Contract(l1.address, abi1.abi, l1.provider)
    this.l2.contract = new Contract(l2.address, abi2.abi, l2.provider)
    this.isRunning = false
    this.lastBlock = 0
    bridgeNode.addComponent(this)
  }
  async start() {
    console.log('#'.repeat(50), 'starting deposit withdraw', '#'.repeat(50))
    this.isRunning = true
    const chainIdBigInt = (await this.l1.provider.getNetwork()).chainId; 
    console.log("chainId", chainIdBigInt.toString())
    const marker = new Marker(chainIdBigInt.toString(), 0);
    this.tracker = new Tracker(this.l1.provider, chainIdBigInt.toString(), marker) 
    console.log("this.tracker", this.tracker)
    this.tracker.addContract(this.l1.address, "L1Vault")
    this.tracker.addComponent(this, "L1Vault")
    await this.tracker.start()
  }
  async stop() {
    this.isRunning = false
  }
  async consume(blockchainEvent){
    console.log("BlockchainEvent consume deposit_withdraw", blockchainEvent)
    await this.bridgeNode.aggregateSignature(blockchainEvent.transactionHash, blockchainEvent.args)
  }
}


DepositWithdraw.id = 'DEPOSIT_WITHDRAW'

export default DepositWithdraw