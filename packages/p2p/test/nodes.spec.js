import {expect} from 'expect'
import Node from '../src/Node.js'
import {setTimeout} from 'node:timers/promises'
import { pipe } from 'it-pipe'
import map from 'it-map'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'

describe('p2p', function () {
  const ipv4 = '127.0.0.1'
  let node1, node2, node3, node4
  const meshProtocol = '/mesh/1.0.0'

  afterEach(async function () {
    if (node1) await node1.stop()
    if (node2) await node2.stop()
    if (node3) await node3.stop()
    if (node4) await node4.stop()
  })
  it('should be able to create two nodes with one leader, one follower', async function () {
    node1 = await new Node(ipv4, 10001, true).create().then(_ => _.start())
    node2 = await new Node(ipv4, 10002).create().then(_ => _.start())
    expect(node1.node.peerId.string).not.toEqual(node2.node.string)
    expect(node1.isLeader).toEqual(true)
    expect(node2.isLeader).toEqual(false)
  })
  it('follower should be able to dial the leader, and both become peer of each other', async function () {
    node1 = await new Node(ipv4, 10001, true).create().then(_ => _.start())
    node2 = await new Node(ipv4, 10002).create().then(_ => _.start())
    const leaderAddr = await node1.node.getMultiaddrs()[0]
    await node2.node.dial(leaderAddr)
    expect(node1.node.getPeers()[0].toString()).toEqual(node2.node.peerId.toString())
    expect(node2.node.getPeers()[0].toString()).toEqual(node1.node.peerId.toString())
  })

  it('should be able to ping a node', async function () {
    node1 = await new Node(ipv4, 10001).create().then(_ => _.start())
    node2 = await new Node(ipv4, 10002).create().then(_ => _.start())
    const latency = await node1.ping(node2.multiaddrs[0])
    expect(latency).toBeGreaterThan(0)
  })

  it('spokes should be able to dial the hub, and become peers of the hub', async function () {
    node1 = await new Node(ipv4, 9001, true).create().then(_ => _.start())
    const leaderAddr = await node1.multiaddrs[0]
    node2 = await new Node(ipv4, 9002).create().then(_ => _.start()).then(_ => _.connect(leaderAddr))
    node3 = await new Node(ipv4, 9003).create().then(_ => _.start()).then(_ => _.connect(leaderAddr))
    node4 = await new Node(ipv4, 9004).create().then(_ => _.start()).then(_ => _.connect(leaderAddr))

    expect(node1.node.getPeers().length).toEqual(3)
    expect(node2.node.getPeers().length).toEqual(1)
    expect(node3.node.getPeers().length).toEqual(1)
    expect(node4.node.getPeers().length).toEqual(1)
    expect(node2.node.getPeers()[0].toString()).toEqual(node1.node.peerId.toString())
    expect(node3.node.getPeers()[0].toString()).toEqual(node1.node.peerId.toString())
    expect(node4.node.getPeers()[0].toString()).toEqual(node1.node.peerId.toString())

  })

  it('should be able to do chat', async function () {
    node1 = await new Node(ipv4, 9001, true).create().then(_ => _.start())
    node2 = await new Node(ipv4, 9002, true).create().then(_ => _.start())
    const stream = node1.createStream(node2.multiaddrs[0], '/chat/1.0.0')

    await node2.addEventListener('peer:connect', (evt) => {
      const remotePeer = evt.detail
      console.log('connected to: ', remotePeer.toString())
    })

    // Handle messages for the protocol
    await node2.node.handle('/chat/1.0.0', async ({ stream }) => {
      console.log('#'.repeat(50), new TextDecoder.decode(await stream.source))
    })
    stream.sink = new TextEncoder().encode('hello')
    await setTimeout(1000)
  })
  it.only('it should send data across stream from node1 to node2', async function () {
    const attestMessage = 'Verified Deposit Hash 12334567'
    let messageRecd = ''
    node1 = await new Node(ipv4, 9001, true).create().then(_ => _.start())
    const leaderAddr = await node1.multiaddrs[0]
    node2 = await new Node(ipv4, 9002).create().then(_ => _.start()).then(_ => _.connect(leaderAddr))
    await node2.node.handle(meshProtocol, async ({ stream }) => {
      pipe(
        stream.source,
        (source) => map(source, (buf) => uint8ArrayToString(buf.subarray())),
        async function (source) {
          for await (const msg of source) {
            console.log(msg.toString())
            messageRecd = msg.toString()
          }
        }
      )
    })
    const stream = await node1.node.dialProtocol(node2.node.getMultiaddrs()[0], meshProtocol)
    const stringArr = [attestMessage]
    pipe(
      stringArr,
      (source) => map(source, (string) => uint8ArrayFromString(string)),
      stream.sink
    )
    await setTimeout(1000);
    expect(attestMessage).toEqual(messageRecd)
    await stream.close()
  })
})
