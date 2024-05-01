import NetworkNode from '../../src/NetworkNode.js'
import {peerIdJsons} from './fixtures.js'

let networkNodes = []
//const memberVectorSecretMap = {}
export const stopNetworkNodes = async () => {
  for (const node of networkNodes) await node.stop()
  networkNodes = []
}
export const startNetworkNodes = async (count, connectToLeader = false) => {
  for (let i = 0; i < count; i++) {
    const node = await new NetworkNode({port: 9000 + i, isLeader: i === 0, peerIdJson: peerIdJsons[i]}).create().then(_ => _.start()).then(_ => {
      networkNodes.push(_)
      return _
    })
    if (connectToLeader && i > 0) await node.connect(networkNodes[0].multiaddrs[0])
  }
  return networkNodes
}