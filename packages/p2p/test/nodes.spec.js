import {expect} from 'expect'
import Node from '../src/Node.js'

describe('p2p', function (){
  const ipv4 = '127.0.0.1'
  let node1, node2, node3, node4
  afterEach(async function (){
    await node1.stop()
    await node2.stop()
    if (node3) await node3.stop()
    if (node4) await node4.stop()
  })
  it('should be able to create two nodes with one leader, one follower', async function (){
    node1 = await new Node(ipv4, 9001, true).create()
    await node1.start()
    node2 = await new Node(ipv4, 9002).create()
    await node2.start()
    console.log('node1:', node1.node.peerId.string)
    console.log('node2:', node2.node.peerId.string)
    expect(node1.node.peerId.string).not.toEqual(node2.node.string)
    expect(node1.isLeader).toEqual(true)
    expect(node2.isLeader).toEqual(false)
  })
  it('follower should be able to dial the leader, and both become peer of each other', async function (){
    node1 = await new Node(ipv4, 9001, true).create()
    await node1.start()
    node2 = await new Node(ipv4, 9002).create()
    await node2.start()

    const leaderAddr = await node1.node.getMultiaddrs()[0]
    await node2.node.dial(leaderAddr);

    expect(node1.node.getPeers()[0].toString()).toEqual(node2.node.peerId.toString())
    expect(node2.node.getPeers()[0].toString()).toEqual(node1.node.peerId.toString())
  })
  it('should be able to ping a node', async function (){
    node1 = await new Node(ipv4, 10001).create()
    await node1.start()
    node2 = await new Node(ipv4, 10002).create()
    await node2.start()
    await node1.ping(node2.multiaddrs[0])
  })

  it('spokes should be able to dial the hub, and become peers of the hub', async function (){
    node1 = await new Node(ipv4, 9001, true).create()
    await node1.start()
    node2 = await new Node(ipv4, 9002).create()
    await node2.start()
    node3 = await new Node(ipv4, 9003).create()
    await node3.start()
    node4 = await new Node(ipv4, 9004).create()
    await node4.start()

    const leaderAddr = await node1.node.getMultiaddrs()[0]
    await node2.node.dial(leaderAddr);
    await node3.node.dial(leaderAddr);
    await node4.node.dial(leaderAddr);

    expect(node1.node.getPeers().length).toEqual(3)
    expect(node2.node.getPeers().length).toEqual(1)
    expect(node3.node.getPeers().length).toEqual(1)
    expect(node4.node.getPeers().length).toEqual(1)
    expect(node2.node.getPeers()[0].toString()).toEqual(node1.node.peerId.toString())
    expect(node3.node.getPeers()[0].toString()).toEqual(node1.node.peerId.toString())
    expect(node4.node.getPeers()[0].toString()).toEqual(node1.node.peerId.toString())

  })
  //Broadcast is not working. Ideally when dial the leader/bootstrap, it should transmit the existing peers to the dialer.

})
