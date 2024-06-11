import {JsonRpcProvider, Contract} from 'ethers'
//fixme: should be getting from src directory. yarn script should save this in /src/abi directory
import abi1 from '../../artifacts/contracts/L1Vault.sol/L1Vault.json' assert {type: 'json'}
import abi2 from '../../artifacts/contracts/L2Vault.sol/L2Vault.json' assert {type: 'json'}

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
    bridgeNode.addComponent(this)
  }

  start() {
    console.log('#'.repeat(50), 'starting deposit withdraw', '#'.repeat(50))
  }
}


DepositWithdraw.id = 'DEPOSIT_WITHDRAW'

export default DepositWithdraw