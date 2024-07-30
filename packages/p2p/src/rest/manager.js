import config from 'config'
import BridgeNode from '../BridgeNode.js'
import {Info} from './Info.js'
import Deposit from '../deposit_withdraw/Deposit.js'

const {bridgeNode: {port, isLeader, contractAddress, providerUrl}} = config
const info = new Info()
const bootstrapNodes = config.bridgeNode.bootstrapNodes
const bridgeNode = new BridgeNode({port, isLeader, json: info.get(), bootstrapNodes})
const deposit = new Deposit(bridgeNode)
bridgeNode.setDeposit(deposit)
info.setBridgeNode(bridgeNode)
await bridgeNode.create()

export default bridgeNode
