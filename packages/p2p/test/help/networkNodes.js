import NetworkNode from '../../src/NetworkNode.js'
import {waitToSync} from '../../src/utils/utils.js'
import {peerIdJsons} from './fixtures.js'

let networkNodes = []
export const stopNetworkNodes = async () => {
  for (const node of networkNodes) await node.stop()
  networkNodes = []
}
export const startNetworkNodes = async (count) => {
  let bootstrapNodes = []
  for (let i = 0; i < count; i++) {
    const node = await new NetworkNode({
      port: 9000 + i,
      peerIdJson: peerIdJsons[i],
      bootstrapNodes,
    }).create().then(_ => _.start()).then(_ => {
      networkNodes.push(_)
      return _
    })
    if (i === 0) bootstrapNodes = node.multiaddrs
  }
  await waitToSync([_ => networkNodes[count - 1].peers.length === networkNodes.length - 1])
  return networkNodes
}
