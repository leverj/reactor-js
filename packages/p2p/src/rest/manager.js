import config from 'config'
import {BridgeNode} from '../BridgeNode.js'
import {Deposit} from '../Deposit.js'
import {Info} from './Info.js'

const {bridgeNode: {port, isLeader, bootstrapNodes}} = config
const info = new Info()
const bridgeNode = await BridgeNode.from({port, isLeader, json: info.get(), bootstrapNodes})
bridgeNode.setDeposit(new Deposit(bridgeNode))
info.setBridgeNode(bridgeNode)
await bridgeNode.start()

export default bridgeNode
