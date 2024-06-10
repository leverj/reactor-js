import config from 'config'
import BlockchainNode from '../BlockchainNode.js'
import BridgeNode from '../BridgeNode.js'

import {Info} from './Info.js'

const {bridgeNode: {port, isLeader, contractAddress, providerUrl}} = config
const info = new Info()
const bootstrapNodes = config.bridgeNode.bootstrapNodes
//FIXME hack for testing now. should be gone after separate e2e tests
let node
if (process.env.CONTRACT_TESTING === 'false') {
  node = new BridgeNode({port, isLeader, json: info.get(), bootstrapNodes})
} else {
  node = new BlockchainNode({port, isLeader, json: info.get(), contractAddress, providerUrl, bootstrapNodes})
}
export default node
info.setBridgeNode(node)
await node.create()
