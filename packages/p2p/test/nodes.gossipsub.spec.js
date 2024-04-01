import { expect } from 'expect'
import Node from '../src/Node.js'
import { GossipSub } from '@chainsafe/libp2p-gossipsub'

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

    node1 = await new Node(ipv4, 9001, true).create().then(_ => _.start())
    const leaderAddr = await node1.multiaddrs[0]
    node2 = await new Node(ipv4, 9002).create().then(_ => _.start()).then(_ => _.connect(leaderAddr))
    node3 = await new Node(ipv4, 9003).create().then(_ => _.start()).then(_ => _.connect(leaderAddr))
    node4 = await new Node(ipv4, 9004).create().then(_ => _.start()).then(_ => _.connect(leaderAddr))

    const peersOfNode1 = await node1.node.getPeers()
    console.log(peersOfNode1)

    const peerStoreOfNode1 = await node1.node.peerStore
    console.log("peerStoreOfNode1", peerStoreOfNode1)
    console.log("all peers in store", await peerStoreOfNode1.all())
    await peerStoreOfNode1.save(peersOfNode1[0], {multiaddrs: node2.node.getMultiaddrs()})
    console.log("all peers in store", await peerStoreOfNode1.all())
    await peerStoreOfNode1.save(peersOfNode1[1], {multiaddrs: node3.node.getMultiaddrs()})
    console.log("all peers in store", await peerStoreOfNode1.all())
    node1.node.services.pubsub.addEventListener('message', (message) => {
      console.log(`Node1 ${message.detail.topic}:`, new TextDecoder().decode(message.detail.data))
    })
    await node1.node.services.pubsub.subscribe('DepositHash')

    const topicDebugs = await node1.node.services.pubsub.getTopics()
    console.log('topics', topicDebugs)
    console.log('subscribers', await node1.node.services.pubsub.getSubscribers(topicDebugs[0]))

    node2.node.services.pubsub.addEventListener('message', (message) => {
      console.log(`Node2 ${message.detail.topic}:`, new TextDecoder().decode(message.detail.data))
    })
    await node2.node.services.pubsub.subscribe('DepositHash')
    await node1.node.services.pubsub.publish('DepositHash', new TextEncoder().encode('Hash 465f7575d7555d77'))
  })

})
