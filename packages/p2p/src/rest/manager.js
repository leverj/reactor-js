import config from 'config'
import BlockchainNode from '../BlockchainNode.js'
import BridgeNode from '../BridgeNode.js'

import {Info} from './Info.js'

const {bridgeNode: {port, isLeader, contractAddress, providerUrl}} = config
const info = new Info()
//FIXME change BridgeNode to BlockchainNode for the new flow
const bootstrapNodes = config.bridgeNode.bootstrapNodes
export const bridgeNode = new BlockchainNode({port, isLeader, json: info.get(), contractAddress, providerUrl, bootstrapNodes})
info.setBridgeNode(bridgeNode)
await bridgeNode.create()
