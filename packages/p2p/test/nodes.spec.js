import {expect} from 'expect'
import {setTimeout} from 'node:timers/promises'
import {peerIdJsons, startNetworkNodes, stopNetworkNodes} from './help/index.js'
import {peerIdFromString} from '@libp2p/peer-id'


describe('p2p', function () {
  const meshProtocol = '/mesh/1.0.0'
  afterEach(stopNetworkNodes)

  it('it should start node with known peerId and should be able to connect', async function () {
    const [node1, node2] = await startNetworkNodes(2)
    expect(node1.peerId).toEqual(peerIdJsons[0].id)
    expect(node2.peerId).toEqual(peerIdJsons[1].id)
    expect(node1.peers.length).toEqual(0)
    await node2.connect(node1.multiaddrs[0])
    expect(node1.peers.length).toEqual(1)
  })

  it('should be able to ping a node', async function () {
    const [node1, node2] = await startNetworkNodes(2)
    const latency = await node1.ping(node2.multiaddrs[0])
    expect(latency).toBeGreaterThan(0)
  })

  it('spokes should be able to dial the hub, and become peers of the hub', async function () {
    const [hub, spoke1, spoke2, spoke3] = await startNetworkNodes(4, true)
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
    const nodes = await startNetworkNodes(6)
    nodes[0].registerStreamHandler(meshProtocol, async (stream, peerId, msg) => {
      messageRecd[peerId] = msg
      nodes[0].sendMessageOnStream(stream, `responding ${msg}`)
    })

    const sendMsg = async (node, message) => await node.createAndSendMessage(nodes[0].multiaddrs[0], meshProtocol, message, (msg) => { responses[node.peerId] = msg })

    for (const node of nodes.slice(1)) await sendMsg(node, `Verified Deposit Hash ${node.port}`)

    await setTimeout(100)
    for (const node of nodes.slice(1)) {
      expect(messageRecd[node.peerId]).toEqual(`Verified Deposit Hash ${node.port}`)
      expect(responses[node.peerId]).toEqual(`responding Verified Deposit Hash ${node.port}`)
    }
    for (const node of nodes.slice(1)) await sendMsg(node, `Verified Deposit Hash ${node.port} again`)
    await setTimeout(100)
    for (const node of nodes.slice(1)) {
      expect(messageRecd[node.peerId]).toEqual(`Verified Deposit Hash ${node.port} again`)
      expect(responses[node.peerId]).toEqual(`responding Verified Deposit Hash ${node.port} again`)
    }
  })


  it('it should send data using gossipsub', async function () {
    const depositReceipts = {} // each node will just save the hash and ack. later children will sign and attest point to point
    const [leader, node2, node3, node4] = await startNetworkNodes(4, true)
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

  it('should only create nodes and discovery should happen automatically', async function(){
    const numNodes = 6
    let nodes = await startNetworkNodes(numNodes)
    await setTimeout(3000)
    for (const node of nodes){
      // console.log("Peers of Node", node.p2p.getPeers())
      expect(node.peers.length).toEqual(numNodes - 1)
      for (const peerId of node.peers){
        const peerInfo = await node.findPeer(peerId)
        const found = peerInfo.multiaddrs[0].toString()
        const expected = nodes.find(node => node.peerId === peerId).multiaddrs[0]
        expect(found.split("/")[3]).toEqual(expected.split("/")[3])
      }
    }
  })
  //FIXME If this test case approach is ok, then p2p occurences can move to NetworkNode
  //basically createAndSendMessage function can be changed to take PeerId as opposed to address (current impl) 
  it.only('should create p2p nodes and send stream message to peers without using their address', async function(){
    const numNodes = 6
    let mesgPrefix = "Hello from sender "
    let nodes = await startNetworkNodes(numNodes)
    await setTimeout(3000)
    for (const node of nodes){
      await node.registerStreamHandler(meshProtocol, function(stream, peerId, msgStr){console.log(node.peerId, "Recd stream msg from", peerId, msgStr)})
    }
    const sender = nodes[0]
    for (const peerId of sender.peers){
      const stream = await sender.p2p.dialProtocol(peerIdFromString(peerId), meshProtocol)
      await sender.sendMessageOnStream(stream, mesgPrefix + Math.random())
    }
    /* following also works since this is the old way. we are just constructing the address w/o storing it. Extra lookup step though.
    const peerId = nodes[1].peerId
    const peerInfo = await nodes[0].findPeer(peerId)
    const peerAddress = peerInfo.multiaddrs[0]
    const addressToSend = peerAddress + '/p2p/' + peerId
    await nodes[0].createAndSendMessage(addressToSend, meshProtocol, "HI", (msg) => {console.log("ACK RESP", msg)})*/
    await setTimeout(1000)
    
  }).timeout(-1)

  // fixme: to be implemented
  it.skip('should not allow to connect a node if not approved', async function () {
    const [node1, node2] = await startNetworkNodes(2)
    node1.connect(node2.multiaddrs[0])
    await setTimeout(100)
    expect(node2.peers.length).toEqual(0)
    expect(node1.peers.length).toEqual(0)
    node1.addToKnownPeers(node2.peerId)
    node1.connect(node2.multiaddrs[0])
    await setTimeout(100)
    expect(node1.peers.length).toEqual(1)
    expect(node2.peers.length).toEqual(1)
  })
})
