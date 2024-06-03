import {expect} from 'expect'
import {setTimeout} from 'node:timers/promises'
import {peerIdJsons, startNetworkNodes, stopNetworkNodes} from './help/index.js'
import {peerIdFromString} from '@libp2p/peer-id'
import {toString as uint8ArrayToString} from 'uint8arrays/to-string'
import { unmarshalPrivateKey, unmarshalPublicKey } from '@libp2p/crypto/keys'
import {x25519, edwardsToMontgomeryPub, edwardsToMontgomeryPriv} from '@noble/curves/ed25519'
import {createFromJSON} from '@libp2p/peer-id-factory'
import AESEncryption from 'aes-encryption'

describe('p2p', function () {
  const meshProtocol = '/mesh/1.0.0'
  afterEach(stopNetworkNodes)

  it('should be able to ping a node', async function () {
    const [node1, node2] = await startNetworkNodes(2)
    const latency = await node1.ping(node2.peerId)
    expect(latency).toBeGreaterThan(0)
  })

  it('it should send data across stream from node1 to node2', async function () {
    const messageRecd = {}
    const responses = {}
    const nodes = await startNetworkNodes(6)
    nodes[0].registerStreamHandler(meshProtocol, async (stream, peerId, msg) => {
      messageRecd[peerId] = msg
      nodes[0].sendMessageOnStream(stream, `responding ${msg}`)
    })

    const sendMsg = async (node, message) => await node.createAndSendMessage(nodes[0].peerId, meshProtocol, message, (msg) => { responses[node.peerId] = msg })

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

  it('should only create nodes and discovery should happen automatically', async function () {
    const numNodes = 6
    let nodes = await startNetworkNodes(numNodes)
    await setTimeout(3000)
    for (const node of nodes) {
      // console.log("Peers of Node", node.p2p.getPeers())
      expect(node.peers.length).toEqual(numNodes - 1)
      for (const peerId of node.peers) {
        const peerInfo = await node.findPeer(peerId)
        const found = peerInfo.multiaddrs[0].toString()
        const expected = nodes.find(node => node.peerId === peerId).multiaddrs[0]
        expect(found.split('/')[3]).toEqual(expected.split('/')[3])
      }
    }
  })
  //FIXME If this test case approach is ok, then p2p occurences can move to NetworkNode
  //basically createAndSendMessage function can be changed to take PeerId as opposed to address (current impl) 
  it('should create p2p nodes and send stream message to peers without using their address', async function () {
    const numNodes = 6
    let mesgPrefix = 'Hello from sender '
    let nodes = await startNetworkNodes(numNodes)
    for (const node of nodes) {
      console.log('Peers of Node', node.peers.length)
    }
    for (const node of nodes) {
      await node.registerStreamHandler(meshProtocol, function (stream, peerId, msgStr) {console.log(node.peerId, 'Recd stream msg from', peerId, msgStr)})
    }
    const sender = nodes[0]
    for (const peerId of sender.peers) {
      const stream = await sender.p2p.dialProtocol(peerIdFromString(peerId), meshProtocol)
      await sender.sendMessageOnStream(stream, mesgPrefix + Math.random())
    }
    /* following also works since this is the old way. we are just constructing the address w/o storing it. Extra lookup step though.
    const peerId = nodes[1].peerId
    const peerInfo = await nodes[0].findPeer(peerId)
    const peerAddress = peerInfo.multiaddrs[0]
    const addressToSend = peerAddress + '/p2p/' + peerId
    await nodes[0].createAndSendMessage(addressToSend, meshProtocol, "HI", (msg) => {console.log("ACK RESP", msg)})*/
    // await setTimeout(1000)

  })

  // fixme: to be implemented
  it.skip('should not allow to connect a node if not approved', async function () {
    const [node1, node2] = await startNetworkNodes(2)
    node1.connect(node2.peerId)
    await setTimeout(100)
    expect(node2.peers.length).toEqual(0)
    expect(node1.peers.length).toEqual(0)
    node1.addToKnownPeers(node2.peerId)
    node1.connect(node2.peerId)
    await setTimeout(100)
    expect(node1.peers.length).toEqual(1)
    expect(node2.peers.length).toEqual(1)
  })

  it('should get public key from peerId', async function () {
    const {privKey, pubKey, id} = peerIdJsons[0]
    const {publicKey} = peerIdFromString(id)
    expect(uint8ArrayToString(publicKey, 'base64')).toEqual(pubKey)

  })

  async function createSharedSecret(privateKey, publicKey){
    let unmarshelledPriv = await unmarshalPrivateKey(privateKey)
    const ms = edwardsToMontgomeryPriv(unmarshelledPriv._key)
    let edwardsPub = await unmarshalPublicKey(publicKey)
    const mp = edwardsToMontgomeryPub(edwardsPub._key)
    return x25519.getSharedSecret(ms, mp)
  }
  function encrypt(message, secretKey){
    const aes = new AESEncryption()
    aes.setSecretKey(secretKey)
    return aes.encrypt(message)
  }
  function decrypt(encrypted, secretKey){
    const aes = new AESEncryption()
    aes.setSecretKey(secretKey)
    return aes.decrypt(encrypted)
  }

  it('message encryption and decryption', async function () {
    const {publicKey: publicKey1, privateKey: privateKey1} = await createFromJSON(peerIdJsons[1])
    const {publicKey: publicKey2, privateKey: privateKey2} = await createFromJSON(peerIdJsons[2])
    const secret1 = await createSharedSecret(privateKey1, publicKey2)
    const secret2 = await createSharedSecret(privateKey2, publicKey1)
    expect(secret1).toEqual(secret2)
    for (const message of ['hello world', 'hello world2', 'jqiweuouqwoeuopqweopiqwoeiwqoiepqwiepiqwpoei']) {
      const encrypted = encrypt(message, uint8ArrayToString(secret1, 'hex'))
      const decrypted = decrypt(encrypted, uint8ArrayToString(secret1, 'hex'))
      expect(decrypted).toEqual(message)
    }
  })
})
