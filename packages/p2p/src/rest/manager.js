import {existsSync, writeFileSync, readFileSync} from 'node:fs'
import path from 'path'
import config from 'config'
import BridgeNode from '../BridgeNode.js'


export async function getBridgeInfo() {
  const file = path.join(config.bridgeNode.confDir, 'info.json')
  if (existsSync(file)) {
    return JSON.parse(readFileSync(file, 'utf8'))
  }
}

export async function saveBridgeInfo(peerIdJson) {
  const file = path.join(config.bridgeNode.confDir, 'info.json')
  await writeFileSync(file, JSON.stringify(peerIdJson, null, 2), 'utf8')
}

const manager = await getBridgeInfo()
export const bridgeNode = new BridgeNode({port: config.bridgeNode.port, isLeader: config.bridgeNode.isLeader, json: manager})
await bridgeNode.create()
await bridgeNode.start()
if (!manager) await saveBridgeInfo(bridgeNode.exportJson())


