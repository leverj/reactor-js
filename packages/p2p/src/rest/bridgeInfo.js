import {writeFile, readFile} from 'node:fs/promises'
import {existsSync} from 'node:fs'
import path from 'path'
import config from 'config'
import BridgeNode from '../BridgeNode.js'

export async function getBridgeInfo() {
  const file = path.join(config.bridgeNode.confDir, 'info.json')
  if (existsSync(file)) {
    return JSON.parse(await readFile(file, 'utf8'))
  }
}

export async function saveBridgeInfo(peerIdJson) {
  const file = path.join(config.bridgeNode.confDir, 'info.json')
  await writeFile(file, JSON.stringify(peerIdJson, null, 2), 'utf8')
}

const bridgeInfo = await getBridgeInfo()
export const bridgeNode = new BridgeNode({port: config.bridgeNode.port, isLeader: config.bridgeNode.isLeader, json: bridgeInfo})
await bridgeNode.create()
await bridgeNode.start()
if (!bridgeInfo) await saveBridgeInfo(bridgeNode.exportJson())


