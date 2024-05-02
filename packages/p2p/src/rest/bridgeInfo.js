import {writeFile, readFile} from 'node:fs/promises'
import {existsSync} from 'node:fs'
import path from 'path'
import config from 'config'
import BridgeNode from '../BridgeNode.js'

export async function getBridgeInfo() {
  const file = path.join(config.bridge.confDir, 'info.json')
  if (existsSync(file)) {
    return JSON.parse(await readFile(file, 'utf8'))
  }
}

export async function saveBridgeInfo(peerIdJson) {
  const file = path.join(config.bridge.confDir, 'info.json')
  await writeFile(file, JSON.stringify(peerIdJson, null, 2), 'utf8')
}

const bridgeInfo = await getBridgeInfo()
export const bridge = new BridgeNode({port: config.bridge.port, isLeader: config.bridge.isLeader, json: bridgeInfo})
await bridge.create()
await bridge.start()
if (!bridgeInfo) await saveBridgeInfo(bridge.exportJson())


