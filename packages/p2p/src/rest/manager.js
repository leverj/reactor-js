import config from 'config'
import BridgeNode from '../BridgeNode.js'
import {Info} from './Info.js'

const {bridgeNode: {port, isLeader}} = config
const info = new Info()
export const bridgeNode = new BridgeNode({port, isLeader, json: info.get()})
info.setBridgeNode(bridgeNode)
await bridgeNode.create()
