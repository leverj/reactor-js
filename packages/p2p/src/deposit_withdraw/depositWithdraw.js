import {JsonRpcProvider, Contract} from 'ethers'
import abi1 from '../abi/L1Vault.json' assert {type: 'json'}
import abi2 from '../abi/L2Vault.json' assert {type: 'json'}
import { Tracker } from './Tracker.js'
import {Marker} from './Marker.js'

/**
 * This class processes Deposit or Withdraw events for a single chain. In generic multi-chain case
 * there could be deposit and withdraw functions/contracts on same chain
 * For our base case of L1 (Deposit) :: L2 (Withdraw), there will be 2 instances of this class, one for L1
 * other for L2. L1 instance will listen for Deposit contract events, L2 instance will listen for withdraw events (for the base case)
 */
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

  /*constructor({bridgeNode, l1, l2}) {
    this.id = DepositWithdraw.id
    this.bridgeNode = bridgeNode
    this.l1 = l1
    this.l2 = l2
    this.l1.contract = new Contract(l1.address, abi1.abi, l1.provider)
    this.l2.contract = new Contract(l2.address, abi2.abi, l2.provider)
    this.isRunning = false
    this.lastBlock = 0
    bridgeNode.addComponent(this)
  }*/
  /*constructor(bridgeNode, provider, depositContract, withdrawContract){
    this.bridgeNode = bridgeNode
    this.provider = provider
    this.depositContract = new Contract(depositContract.address, depositContract.abi, this.provider)
    this.withdrawContract = new Contract(withdrawContract.address, withdrawContract.abi, this.provider)
    this.depositTopic = [depositContract.topic]
    this.withdrawTopic = [withdrawContract.topic]
  }*/
  //Event Origination Chain is where the event of interest originates, either Deposit or Withdraw, basically the chain on which Bridge Node will listen
  //Verifier Chain is where the proof of event will be submitted and same action will be replicated. e.g.
  //Deposit happens on Event Chain (L1) and then verification happens on verifier chain (L2) and deposit is replicated
  //Withdraw happens on Event Chain (L2) and then verification happens on verifier chain (L1) and withdraw is replicated
  constructor(eventOriginationChain, verifierChain, bridgeNode){
    this.bridgeNode = bridgeNode
    this.eventOriginationChain = eventOriginationChain
    this.verifierChain = verifierChain
  }
  async start() {
    console.log('#'.repeat(50), 'starting deposit withdraw', '#'.repeat(50))
    //Tracker only tracks the "source" of events, not the sink. So, either Deposit on Source, or Withdraw from Target
    const allTopics = [];
    allTopics.push(this.eventOriginationChain.depositTopic)
    allTopics.push(this.eventOriginationChain.withdrawTopic)
    this.tracker = new Tracker({
      provider: this.eventOriginationChain.provider,
      chainId: (await this.eventOriginationChain.provider.getNetwork()).chainId,
      topics: allTopics
      /*event_generating_contracts: [{
        contract_address:'',
        contract_abi: '',
        topics: [],
        eventType: this.eventType //Deposit or Withdraw. This Could be a redundant flag, and may get removed
      }
      ]*/
    })
    /*this.isRunning = true
    const chainIdBigInt = (await this.l1.provider.getNetwork()).chainId; 
    console.log("chainId", chainIdBigInt.toString())
    const marker = new Marker(chainIdBigInt.toString(), 0);
    this.tracker = new Tracker(this.l1.provider, chainIdBigInt.toString(), marker) 
    console.log("this.tracker", this.tracker)
    this.tracker.addContract(this.l1.address, "L1Vault")
    this.tracker.addComponent(this, "L1Vault")
    await this.tracker.start()*/
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