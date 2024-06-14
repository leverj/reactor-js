import {deployContract, provider, getSigners} from './hardhat.cjs'
import BlockchainNode from '../../src/BlockchainNode.js'
import {bridgeInfos} from './fixtures.js'
import {setTimeout} from 'timers/promises'
import DepositWithdraw from '../../src/deposit_withdraw/depositWithdraw.js'
import Manager from '../../src/deposit_withdraw/Manager.js'
export const nodes = []

export const stop = async () => {
  for (const node of nodes) await node.stop()
  nodes.length = 0
}
export const createChain = async () => {
  const contract1 =  await deployContract('L1Vault', [])
  const contract2 =  await deployContract('L2Vault', [])
  return {
    l1: {
      provider: provider,
      depositContract: contract1,
      depositTopic: '0xc6d85822d86b60b41984292074ead1b48e583535e9e12c2098fe3f6b04a56444',
      //withdrawContract: contract1,
      //withdrawTopic: ''
    },
    l2: {
      provider: provider,
      //depositContract: contract1,
      //depositTopic: '',
      withdrawContract: contract2,
      withdrawTopic: ''
    }
  }
}

class MockBridgeNode {
  constructor() {
    this.components = {}
  }
  addComponent(component) {
    this.components[component.id] = component
  }
  aggregateSignature(txnHash, data){
    console.log("Do aggregate signature for ", txnHash, data)
  }
}


export const createComponent = async (l1, l2, bridgeNode = new MockBridgeNode()) => {
  /*let depositWithdraw = new DepositWithdraw({bridgeNode, l1, l2})
  depositWithdraw.start()
  return depositWithdraw*/
  const manager = new Manager(bridgeNode)
  await manager.createL1andL2(l1, l2)

}

export const createNodes = async (count, provider, contractAddress) => {
  let bootstrapNodes = []
  for (let i = 0; i < count; i++) {
    // console.log('creating node', i, bootstrapNodes)
    const node = BlockchainNode.fromConfiguredEvms({port: 9000 + i, isLeader: i === 0, json: bridgeInfos[i], provider, contractAddress, bootstrapNodes})
    await node.create()
    await node.start()
    await setTimeout(100)
    if(i === 0) bootstrapNodes = node.multiaddrs
    nodes.push(node)
  }
  return nodes

}