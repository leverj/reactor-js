import {existsSync, writeFileSync, readFileSync} from 'node:fs'
import path from 'path'
import config from 'config'
import BridgeNode from '../BridgeNode.js'
import events, {DKG_DONE} from '../events.js'


export function getBridgeInfo() {
  const file = path.join(config.bridgeNode.confDir, 'info.json')
  if (!existsSync(file)) return
  return JSON.parse(readFileSync(file, 'utf8'))
}

export function saveBridgeInfo(peerIdJson) {
  const file = path.join(config.bridgeNode.confDir, 'info.json')
  writeFileSync(file, JSON.stringify(peerIdJson, null, 2), 'utf8')
}

const bridgeInfo = getBridgeInfo()
export const bridgeNode = new BridgeNode({port: config.bridgeNode.port, isLeader: config.bridgeNode.isLeader, json: bridgeInfo})
events.on(DKG_DONE, () => saveBridgeInfo(bridgeNode.exportJson()))
await bridgeNode.create()
await bridgeNode.start()
if (!bridgeInfo) saveBridgeInfo(bridgeNode.exportJson())

