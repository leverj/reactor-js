import {expect} from 'expect'
import {setTimeout} from 'node:timers/promises'
import {newNode, stopNodes} from './help.js'

describe('p2p', function () {
  const meshProtocol = '/mesh/1.0.0'
  afterEach(stopNodes)

  it('should be able to create two nodes with one leader, one follower', async function () {
    const node1 = await newNode({port: 10001, isLeader: true})
    const node2 = await newNode({port: 10002})
    expect(node1.node.peerId.string).not.toEqual(node2.node.string)
    expect(node1.isLeader).toEqual(true)
    expect(node2.isLeader).toEqual(false)
  })
  it('follower should be able to dial the leader, and both become peer of each other', async function () {
    const node1 = await newNode({port: 10001, isLeader: true})
    const node2 = await newNode({port: 10002})
    const leaderAddr = await node1.node.getMultiaddrs()[0]
    await node2.node.dial(leaderAddr)
    expect(node1.node.getPeers()[0].toString()).toEqual(node2.node.peerId.toString())
    expect(node2.node.getPeers()[0].toString()).toEqual(node1.node.peerId.toString())
  })

  it('should be able to ping a node', async function () {
    const node1 = await newNode({port: 10001})
    const node2 = await newNode({port: 10002})
    const latency = await node1.ping(node2.multiaddrs[0])
    expect(latency).toBeGreaterThan(0)
  })

  it('spokes should be able to dial the hub, and become peers of the hub', async function () {
    const node1 = await newNode({port: 9001, isLeader: true})
    const leaderAddr = await node1.multiaddrs[0]
    const node2 = await newNode({port: 9002}).then(_ => _.connect(leaderAddr))
    const node3 = await newNode({port: 9003}).then(_ => _.connect(leaderAddr))
    const node4 = await newNode({port: 9004}).then(_ => _.connect(leaderAddr))

    expect(node1.node.getPeers().length).toEqual(3)
    expect(node2.node.getPeers().length).toEqual(1)
    expect(node3.node.getPeers().length).toEqual(1)
    expect(node4.node.getPeers().length).toEqual(1)
    expect(node2.node.getPeers()[0].toString()).toEqual(node1.node.peerId.toString())
    expect(node3.node.getPeers()[0].toString()).toEqual(node1.node.peerId.toString())
    expect(node4.node.getPeers()[0].toString()).toEqual(node1.node.peerId.toString())

  })

  it('it should send data across stream from node1 to node2', async function () {
    const messageRecd = {}
    const responses = {}
    const responses = {}
    const node1 = await newNode({port: 9001, isLeader: true})
    node1.registerStreamHandler(meshProtocol, async (stream, peerId, msg) => {
      messageRecd[peerId] = msg
      node1.sendMessage(stream, `responding ${msg}`)
    })
    const leaderAddr = await node1.multiaddrs[0]
    const sendMsg = async (node, message) => await node.createAndSendMessage(node1.multiaddrs[0], meshProtocol, message, (msg) => { responses[node.peerId] = msg })
    const node2 = await newNode({port:9002}).then(_ => _.connect(leaderAddr))
    await sendMsg(node2, 'Verified Deposit Hash 2')
    const node3 = await newNode({port:9003}).then(_ => _.connect(leaderAddr))
    await sendMsg(node3, 'Verified Deposit Hash 3')
    const node4 = await newNode({port:9004}).then(_ => _.connect(leaderAddr))

    await sendMsg(node4, 'Verified Deposit Hash 4')
    await setTimeout(100)
    expect(messageRecd[node2.peerId]).toEqual('Verified Deposit Hash 2')
    expect(messageRecd[node3.peerId]).toEqual('Verified Deposit Hash 3')
    expect(messageRecd[node4.peerId]).toEqual('Verified Deposit Hash 4')
    expect(responses[node2.peerId]).toEqual('responding Verified Deposit Hash 2')
    expect(responses[node3.peerId]).toEqual('responding Verified Deposit Hash 3')
    expect(responses[node4.peerId]).toEqual('responding Verified Deposit Hash 4')

    for (const node of [node2, node3, node4]) await sendMsg(node, `Verified Deposit Hash ${node.port}`)
    await setTimeout(100)
    expect(messageRecd[node2.peerId]).toEqual(`Verified Deposit Hash ${node2.port}`)
    expect(messageRecd[node3.peerId]).toEqual(`Verified Deposit Hash ${node3.port}`)
    expect(messageRecd[node4.peerId]).toEqual(`Verified Deposit Hash ${node4.port}`)
    expect(responses[node2.peerId]).toEqual(`responding Verified Deposit Hash ${node2.port}`)
    expect(responses[node3.peerId]).toEqual(`responding Verified Deposit Hash ${node3.port}`)
    expect(responses[node4.peerId]).toEqual(`responding Verified Deposit Hash ${node4.port}`)
  })

  it('it should start node with same peerId', async function () {
    const node1 = await newNode({port: 9001})
    const exported = node1.exportPeerId()
    const node2 = await newNode({port: 9002, peerIdJson: exported})
    expect(node1.peerId).toEqual(node2.peerId)

  })


})
