import config from 'config'
import {BridgeNode} from '../BridgeNode.js'
import {Deposit} from '../Deposit.js'
import {Info} from './Info.js'

const {bridgeNode: {port, isLeader, bootstrapNodes}} = config
const info = new Info()
const bridgeNode = new BridgeNode({port, isLeader, json: info.get(), bootstrapNodes})
bridgeNode.setDeposit(new Deposit(bridgeNode))
info.setBridgeNode(bridgeNode)
await bridgeNode.create()

export default bridgeNode
