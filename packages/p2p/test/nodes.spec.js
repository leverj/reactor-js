import {expect} from 'expect'
import Node from '../src/Node.js'
import {setTimeout} from 'node:timers/promises'

describe('p2p', function () {
  let node1, node2, node3, node4
  const meshProtocol = '/mesh/1.0.0'

  afterEach(async function () {
    if (node1) await node1.stop()
    if (node2) await node2.stop()
    if (node3) await node3.stop()
    if (node4) await node4.stop()
  })
  it('should be able to create two nodes with one leader, one follower', async function () {
    node1 = await new Node({port: 10001, isLeader: true}).create().then(_ => _.start())
    node2 = await new Node({port: 10002}).create().then(_ => _.start())
    expect(node1.node.peerId.string).not.toEqual(node2.node.string)
    expect(node1.isLeader).toEqual(true)
    expect(node2.isLeader).toEqual(false)
  })
  it('follower should be able to dial the leader, and both become peer of each other', async function () {
    node1 = await new Node({port: 10001, isLeader: true}).create().then(_ => _.start())
    node2 = await new Node({port: 10002}).create().then(_ => _.start())
    const leaderAddr = await node1.node.getMultiaddrs()[0]
    await node2.node.dial(leaderAddr)
    expect(node1.node.getPeers()[0].toString()).toEqual(node2.node.peerId.toString())
    expect(node2.node.getPeers()[0].toString()).toEqual(node1.node.peerId.toString())
  })

  it('should be able to ping a node', async function () {
    node1 = await new Node({port: 10001}).create().then(_ => _.start())
    node2 = await new Node({port: 10002}).create().then(_ => _.start())
    const latency = await node1.ping(node2.multiaddrs[0])
    expect(latency).toBeGreaterThan(0)
  })

  it('spokes should be able to dial the hub, and become peers of the hub', async function () {
    node1 = await new Node({port: 9001, isLeader: true}).create().then(_ => _.start())
    const leaderAddr = await node1.multiaddrs[0]
    node2 = await new Node({port: 9002}).create().then(_ => _.start()).then(_ => _.connect(leaderAddr))
    node3 = await new Node({port: 9003}).create().then(_ => _.start()).then(_ => _.connect(leaderAddr))
    node4 = await new Node({port: 9004}).create().then(_ => _.start()).then(_ => _.connect(leaderAddr))

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
    node1 = await new Node({port: 9001, isLeader: true}).create().then(_ => _.start())
    node1.registerStreamHandler(meshProtocol, async (stream, peerId, msg) => {
      messageRecd[peerId] = msg
      node1.sendMessage(stream, `responding ${msg}`)
    })

    const leaderAddr = await node1.multiaddrs[0]

    const newNode = async (port) => await new Node({port}).create().then(_ => _.start()).then(_ => _.connect(leaderAddr))
    const sendMsg = async (node, message) => await node.createAndSendMessage(node1.multiaddrs[0], meshProtocol, message, (msg) => { responses[node.peerId] = msg })

    node2 = await newNode(9002)
    await sendMsg(node2, 'Verified Deposit Hash 2')
    node3 = await newNode(9003)
    await sendMsg(node3, 'Verified Deposit Hash 3')
    node4 = await newNode(9004)

    await sendMsg(node4, 'Verified Deposit Hash 4')
    await setTimeout(100)
    expect(messageRecd[node2.peerId]).toEqual('Verified Deposit Hash 2')
    expect(messageRecd[node3.peerId]).toEqual('Verified Deposit Hash 3')
    expect(messageRecd[node4.peerId]).toEqual('Verified Deposit Hash 4')
    expect(responses[node2.peerId]).toEqual('responding Verified Deposit Hash 2')
    expect(responses[node3.peerId]).toEqual('responding Verified Deposit Hash 3')
    expect(responses[node4.peerId]).toEqual('responding Verified Deposit Hash 4')

    for (const node of [node2, node3, node4]) sendMsg(node, `Verified Deposit Hash ${node.port}`)
    await setTimeout(100)
    expect(messageRecd[node2.peerId]).toEqual(`Verified Deposit Hash ${node2.port}`)
    expect(messageRecd[node3.peerId]).toEqual(`Verified Deposit Hash ${node3.port}`)
    expect(messageRecd[node4.peerId]).toEqual(`Verified Deposit Hash ${node4.port}`)
    expect(responses[node2.peerId]).toEqual(`responding Verified Deposit Hash ${node2.port}`)
    expect(responses[node3.peerId]).toEqual(`responding Verified Deposit Hash ${node3.port}`)
    expect(responses[node4.peerId]).toEqual(`responding Verified Deposit Hash ${node4.port}`)
  })

  it('it should start node with same peerId', async function () {
    node1 = await new Node({port: 9001}).create().then(_ => _.start())
    const exported = node1.exportPeerId()
    node2 = await new Node({port: 9002, peerIdJson: exported}).create().then(_ => _.start())
    expect(node1.peerId).toEqual(node2.peerId)

  })


})
