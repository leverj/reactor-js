import config from 'config'
import BlockchainNode from '../BlockchainNode.js'
import BridgeNode from '../BridgeNode.js'

import {Info} from './Info.js'

const {bridgeNode: {port, isLeader, contractAddress, providerUrl}} = config
const info = new Info()
//FIXME change BridgeNode to BlockchainNode for the new flow
export const bridgeNode = new BridgeNode({port, isLeader, json: info.get(), contractAddress, providerUrl})
info.setBridgeNode(bridgeNode)
await bridgeNode.create()
