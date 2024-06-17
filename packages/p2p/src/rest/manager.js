import config from 'config'
import BridgeNode from '../BridgeNode.js'
import {Info} from './Info.js'

const {bridgeNode: {port, isLeader, contractAddress, providerUrl}} = config
const info = new Info()
const bootstrapNodes = config.bridgeNode.bootstrapNodes
const bridgeNode = new BridgeNode({port, isLeader, json: info.get(), bootstrapNodes})
info.setBridgeNode(bridgeNode)
await bridgeNode.create()

export default bridgeNode