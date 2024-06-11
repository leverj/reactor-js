import config from 'config'
import BridgeNode from '../BridgeNode.js'
import {Info} from './Info.js'
import DepositWithdraw from '../deposit_withdraw/depositWithdraw.js'

const componentsMap = {
  [DepositWithdraw.id]: DepositWithdraw,
}

const {bridgeNode: {port, isLeader, contractAddress, providerUrl}} = config
const info = new Info()
const bootstrapNodes = config.bridgeNode.bootstrapNodes
const bridgeNode = new BridgeNode({port, isLeader, json: info.get(), bootstrapNodes})
info.setBridgeNode(bridgeNode)
await bridgeNode.create()
for (const component of config.components) {
  const componentInstance = componentsMap[component].from(bridgeNode, config)
  componentInstance.start()
}

export default bridgeNode