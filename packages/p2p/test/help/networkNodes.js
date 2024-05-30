import NetworkNode from '../../src/NetworkNode.js'
import {peerIdJsons} from './fixtures.js'
import {waitToSync} from '../../src/utils.js'

let networkNodes = []
export const stopNetworkNodes = async () => {
  for (const node of networkNodes) await node.stop()
  networkNodes = []
}
export const startNetworkNodes = async (count) => {
  for (let i = 0; i < count; i++) {
    const node = await new NetworkNode({port: 9000 + i, peerIdJson: peerIdJsons[i]}).create().then(_ => _.start()).then(_ => {
      networkNodes.push(_)
      return _
    })
  }
  await waitToSync([ _ => networkNodes[count-1].peers.length === networkNodes.length - 1])
  return networkNodes
}