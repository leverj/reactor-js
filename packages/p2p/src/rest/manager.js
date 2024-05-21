import config from 'config'
import BridgeNode from '../BridgeNode.js'
import {Info} from './Info.js'

const info = new Info()
export const bridgeNode = new BridgeNode({port: config.bridgeNode.port, isLeader: config.bridgeNode.isLeader, json: info.get()})
info.setBridgeNode(bridgeNode)
await bridgeNode.create()
await bridgeNode.start()
