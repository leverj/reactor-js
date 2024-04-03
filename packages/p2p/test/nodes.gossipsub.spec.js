import {expect} from 'expect'
import {setTimeout} from 'node:timers/promises'
import {newNode, stopNodes} from './help.js'
describe('p2p.gossipsub', function () {
  afterEach(stopNodes)
  it('it should send data using gossipsub', async function () {
    const depositReceipts = {} // each node will just save the hash and ack. later children will sign and attest point to point
    const leader = await newNode({port:9001, isLeader:true})
    const leaderAddr = await leader.multiaddrs[0]
    const node2 = await newNode({port:9002}).then(_ => _.connect(leaderAddr))
    const node3 = await newNode({port:9003}).then(_ => _.connect(leaderAddr))
    const node4 = await newNode({port:9004}).then(_ => _.connect(leaderAddr))
    for (const node of [node2, node3, node4]) {
      await node.connectPubSub(
        leader.peerId,
        ({peerId, topic, data}) => {(topic === 'DepositHash') && (depositReceipts[node.peerId] = data)}
      )
      await node.subscribe('DepositHash')
    }
    await setTimeout(100)
    let depositHash = '0xbef807c488b8a3db6834ee242ff888e9ebb5961deb9323c8da97853b43755aab'
    await leader.publish('DepositHash', depositHash)
    await setTimeout(100)
    expect(leader.peers.length).toEqual(3)
    for (const peerOfNode1 of leader.peers) {
      expect(depositReceipts[peerOfNode1.toString()]).toEqual(depositHash)
    }

    await leader.publish('DepositHash', depositHash + depositHash)
    await setTimeout(100)
    expect(leader.peers.length).toEqual(3)
    for (const peerOfNode1 of leader.peers) {
      expect(depositReceipts[peerOfNode1.toString()]).toEqual(depositHash + depositHash)
    }

  }).timeout(10000)

})