import {expect} from 'expect'
import Node from '../src/Node.js'
import {setTimeout} from 'node:timers/promises'

describe('p2p.gossipsub', function () {
  const ipv4 = '127.0.0.1'
  let node1, node2, node3, node4
  afterEach(async function () {
    if (node1) await node1.stop()
    if (node2) await node2.stop()
    if (node3) await node3.stop()
    if (node4) await node4.stop()
  })

  it('it should send data using gossipsub', async function () {
    const depositReceipts = {} // each node will just save the hash and ack. later children will sign and attest point to point
    node1 = await new Node(ipv4, 9001, true).create().then(_ => _.start())
    const leaderAddr = await node1.multiaddrs[0]
    node2 = await new Node(ipv4, 9002).create().then(_ => _.start()).then(_ => _.connect(leaderAddr))
    node3 = await new Node(ipv4, 9003).create().then(_ => _.start()).then(_ => _.connect(leaderAddr))
    node4 = await new Node(ipv4, 9004).create().then(_ => _.start()).then(_ => _.connect(leaderAddr))
    for (const node of [node2, node3, node4]) {
      await node.connectPubSub(
        node1.peerId,
        ({peerId, topic, data}) => {(topic === 'DepositHash') && (depositReceipts[node.peerId] = data)}
      )
      await node.subscribe('DepositHash')
    }
    await setTimeout(100)
    let depositHash = '0xbef807c488b8a3db6834ee242ff888e9ebb5961deb9323c8da97853b43755aab'
    await node1.publish('DepositHash', depositHash)
    await setTimeout(100)
    expect(node1.peers.length).toEqual(3)
    for (const peerOfNode1 of node1.peers) {
      expect(depositReceipts[peerOfNode1.toString()]).toEqual(depositHash)
    }
  }).timeout(10000)

})