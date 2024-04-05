import {expect} from 'expect'
import {setTimeout} from 'node:timers/promises'
import {peerIdJsons, startNodes, stopNodes} from './help.js'

describe('p2p', function () {
  const meshProtocol = '/mesh/1.0.0'
  afterEach(stopNodes)

  it('it should start node with known peerId and should be able to connect', async function () {
    const [node1, node2] = await startNodes(2)
    expect(node1.peerId).toEqual(peerIdJsons[0].id)
    expect(node2.peerId).toEqual(peerIdJsons[1].id)
    expect(node1.peers.length).toEqual(0)
    await node2.connect(node1.multiaddrs[0])
    expect(node1.peers.length).toEqual(1)
  })

  it('should be able to ping a node', async function () {
    const [node1, node2] = await startNodes(2)
    const latency = await node1.ping(node2.multiaddrs[0])
    expect(latency).toBeGreaterThan(0)
  })

  it('spokes should be able to dial the hub, and become peers of the hub', async function () {
    const [hub, spoke1, spoke2, spoke3] = await startNodes(4, true)
    expect(hub.peers.length).toEqual(3)
    expect(spoke1.peers.length).toEqual(1)
    expect(spoke2.peers.length).toEqual(1)
    expect(spoke3.peers.length).toEqual(1)
    expect(spoke1.peers[0]).toEqual(hub.peerId)
    expect(spoke2.peers[0]).toEqual(hub.peerId)
    expect(spoke3.peers[0]).toEqual(hub.peerId)
  })

  it('it should send data across stream from node1 to node2', async function () {
    const messageRecd = {}
    const responses = {}
    const [node1, node2, node3, node4] = await startNodes(4, true)
    node1.registerStreamHandler(meshProtocol, async (stream, peerId, msg) => {
      messageRecd[peerId] = msg
      node1.sendMessage(stream, `responding ${msg}`)
    })

    const sendMsg = async (node, message) => await node.createAndSendMessage(node1.multiaddrs[0], meshProtocol, message, (msg) => { responses[node.peerId] = msg })

    for (const node of [node2, node3, node4]) await sendMsg(node, `Verified Deposit Hash ${node.port}`)

    await setTimeout(100)
    expect(messageRecd[node2.peerId]).toEqual(`Verified Deposit Hash ${node2.port}`)
    expect(messageRecd[node3.peerId]).toEqual(`Verified Deposit Hash ${node3.port}`)
    expect(messageRecd[node4.peerId]).toEqual(`Verified Deposit Hash ${node4.port}`)
    expect(responses[node2.peerId]).toEqual(`responding Verified Deposit Hash ${node2.port}`)
    expect(responses[node3.peerId]).toEqual(`responding Verified Deposit Hash ${node3.port}`)
    expect(responses[node4.peerId]).toEqual(`responding Verified Deposit Hash ${node4.port}`)

    for (const node of [node2, node3, node4]) await sendMsg(node, `Verified Deposit Hash ${node.port} again`)
    await setTimeout(100)
    expect(messageRecd[node2.peerId]).toEqual(`Verified Deposit Hash ${node2.port} again`)
    expect(messageRecd[node3.peerId]).toEqual(`Verified Deposit Hash ${node3.port} again`)
    expect(messageRecd[node4.peerId]).toEqual(`Verified Deposit Hash ${node4.port} again`)
    expect(responses[node2.peerId]).toEqual(`responding Verified Deposit Hash ${node2.port} again`)
    expect(responses[node3.peerId]).toEqual(`responding Verified Deposit Hash ${node3.port} again`)
    expect(responses[node4.peerId]).toEqual(`responding Verified Deposit Hash ${node4.port} again`)
  })


  it('it should send data using gossipsub', async function () {
    const depositReceipts = {} // each node will just save the hash and ack. later children will sign and attest point to point
    const [leader, node2, node3, node4] = await startNodes(4, true)
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
      expect(depositReceipts[peerOfNode1]).toEqual(depositHash)
    }

    await leader.publish('DepositHash', depositHash + depositHash)
    await setTimeout(100)
    expect(leader.peers.length).toEqual(3)
    for (const peerOfNode1 of leader.peers) {
      expect(depositReceipts[peerOfNode1]).toEqual(depositHash + depositHash)
    }
  })
})
