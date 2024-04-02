import { expect } from 'expect'
import Node from '../src/Node.js'

describe('p2p.gossipsub', function () {
  const ipv4 = '127.0.0.1'
  let node1, node2, node3, node4
  afterEach(async function () {
    if (node1) await node1.stop()
    if (node2) await node2.stop()
    if (node3) await node3.stop()
    if (node4) await node4.stop()
  })

  it.only('it should send data using gossipsub', async function () {
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const depositReceipts = {}; // each node will just save the hash and ack. later children will sign and attest point to point
    node1 = await new Node(ipv4, 9001, true).create().then(_ => _.start())
    const leaderAddr = await node1.multiaddrs[0]
    node2 = await new Node(ipv4, 9002).create().then(_ => _.start()).then(_ => _.connect(leaderAddr))
    node3 = await new Node(ipv4, 9003).create().then(_ => _.start()).then(_ => _.connect(leaderAddr))
    node4 = await new Node(ipv4, 9004).create().then(_ => _.start()).then(_ => _.connect(leaderAddr))
    const handler = ({ connection, stream, protocol }) => {
       console.log('#####################################################handle')
    }
    for (const node of [node2, node3, node4]){
      console.log('Child node Peer of Node1', node.node.peerId.toString())
      node.node.handle('/meshsub/1.1.0', handler, {
        maxInboundStreams: 5,
        maxOutboundStreams: 5
      })
      node.node.services.pubsub.addEventListener('message', (message) => {
        console.log(`Recd Deposit Hash from Leader, by Child Node ${node.node.peerId.toString()} on topic ${message.detail.topic}:`, new TextDecoder().decode(message.detail.data))
        depositReceipts[node.node.peerId.toString()] = new TextDecoder().decode(message.detail.data)
      })
      await node1.node.services.pubsub.connect(node.node.peerId.toString())
      await node.node.services.pubsub.subscribe('DepositHash')
      //await node.node.services.pubsub.start()
    }
    
    await delay(1000)
    const depositHash = '0xbef807c488b8a3db6834ee242ff888e9ebb5961deb9323c8da97853b43755aab'
    await node1.node.services.pubsub.publish('DepositHash', new TextEncoder().encode(depositHash))
    await delay(1000)
    for (const peerOfNode1 of  node1.node.getPeers()){
      expect(depositReceipts[peerOfNode1.toString()]).toEqual(depositHash)
    }
  })

})