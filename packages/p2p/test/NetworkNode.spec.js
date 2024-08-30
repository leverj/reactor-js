import {logger} from '@leverj/common/utils'
import {unmarshalPrivateKey, unmarshalPublicKey} from '@libp2p/crypto/keys'
import {peerIdFromString} from '@libp2p/peer-id'
import {createFromJSON} from '@libp2p/peer-id-factory'
import {edwardsToMontgomeryPriv, edwardsToMontgomeryPub, x25519} from '@noble/curves/ed25519'
import AesEncryption from 'aes-encryption'
import {expect} from 'expect'
import {setTimeout} from 'node:timers/promises'
import {toString as uint8ArrayToString} from 'uint8arrays/to-string'
import {NetworkNode} from '../src/NetworkNode.js'
import {waitToSync} from '../src/utils.js'
import {peerIdJsons} from './fixtures.js'

describe('NetworkNode', () => {
  const meshProtocol = '/mesh/1.0.0'
  const nodes = []

  afterEach(async () => {
    for (let each of nodes) await each.stop()
    nodes.length = 0
  })

  const startNetworkNodes = async (count) => {
    let bootstrapNodes = []
    for (let i = 0; i < count; i++) {
      const node = await NetworkNode.from(10000 + i, peerIdJsons[i], bootstrapNodes)
      await node.start()
      nodes.push(node)
      if (i === 0) bootstrapNodes = node.multiaddrs
    }
    await waitToSync([_ => nodes[count - 1].peers.length === nodes.length - 1])
  }

  it('should be able to ping a node', async () => {
    await startNetworkNodes(2)
    const [node1, node2] = nodes
    const latency = await node1.ping(node2.peerId)
    expect(latency).toBeGreaterThan(0)
  })

  it('it should send data across stream from node1 to node2', async () => {
    const messages = {}
    const responses = {}
    await startNetworkNodes(6)
    const leader = nodes[0]
    leader.registerStreamHandler(meshProtocol, async (stream, peerId, message) => {
      messages[peerId] = message
      leader.sendMessageOnStream(stream, `responding ${message}`)
    })
    const sendMessage = async (node, message) => node.createAndSendMessage(leader.peerId, meshProtocol, message, _ => responses[node.peerId] = _)
    for (let each of nodes.slice(1)) await sendMessage(each, `Verified Transfer Hash ${each.port}`)
    await setTimeout(10)
    for (let each of nodes.slice(1)) {
      expect(messages[each.peerId]).toEqual(`Verified Transfer Hash ${each.port}`)
      expect(responses[each.peerId]).toEqual(`responding Verified Transfer Hash ${each.port}`)
    }

    for (let each of nodes.slice(1)) await sendMessage(each, `Verified Transfer Hash ${each.port} again`)
    await setTimeout(10)
    for (let each of nodes.slice(1)) {
      expect(messages[each.peerId]).toEqual(`Verified Transfer Hash ${each.port} again`)
      expect(responses[each.peerId]).toEqual(`responding Verified Transfer Hash ${each.port} again`)
    }
  })

  it('it should send data using gossipsub', async () => {
    const transferReceipts = {} // each node will just save the transferHash and ack. later children will sign and attest point to point
    await startNetworkNodes(4)
    const [leader, node2, node3, node4] = nodes
    for (let each of [node2, node3, node4]) {
      await each.connectPubSub(
        leader.peerId,
        ({topic, data}) => (topic === 'TransferHash') && (transferReceipts[each.peerId] = data),
      )
      await each.subscribe('TransferHash')
    }
    await setTimeout(10)
    const transferHash = '0xbef807c488b8a3db6834ee242ff888e9ebb5961deb9323c8da97853b43755aab'
    await leader.publish('TransferHash', transferHash)
    await setTimeout(10)
    expect(leader.peers.length).toEqual(3)
    for (let each of leader.peers) expect(transferReceipts[each]).toEqual(transferHash)

    await leader.publish('TransferHash', transferHash + transferHash) //fixme: reason for duplication?
    await setTimeout(10)
    expect(leader.peers.length).toEqual(3)
    for (let each of leader.peers) expect(transferReceipts[each]).toEqual(transferHash + transferHash)
  })

  it('should only create nodes and discovery should happen automatically', async () => {
    const numNodes = 6
    await startNetworkNodes(numNodes)
    for (let node of nodes) {
      expect(node.peers.length).toEqual(numNodes - 1)
      for (let peer of node.peers) {
        const peerInfo = await node.findPeer(peer)
        const found = peerInfo.multiaddrs[0].toString()
        const expected = nodes.find(node => node.peerId === peer).multiaddrs[0]
        expect(found.split('/')[3]).toEqual(expected.split('/')[3])
      }
    }
  })

  //FIXME If this test case approach is ok, then p2p occurences can move to NetworkNode
  //basically createAndSendMessage function can be changed to take PeerId as opposed to address (current impl)
  it('should create p2p nodes and send stream message to peers without using their address', async () => {
    const numNodes = 6
    const mesgPrefix = 'Hello from sender '
    await startNetworkNodes(numNodes)
    for (let each of nodes) logger.log('Peers of Node', each.peers.length)
    for (let each of nodes) {
      await each.registerStreamHandler(meshProtocol, function (stream, peerId, msgStr) {
        logger.log(each.peerId, 'Recd stream message from', peerId, msgStr)
      })
    }
    const sender = nodes[0]
    for (let each of sender.peers) {
      const stream = await sender.p2p.dialProtocol(peerIdFromString(each), meshProtocol)
      await sender.sendMessageOnStream(stream, mesgPrefix + Math.random())
    }

    /* following also works since this is the old way. we are just constructing the address w/o storing it. Extra lookup step though.
    const peerId = nodes[1].peerId
    const peerInfo = await nodes[0].findPeer(peerId)
    const peerAddress = peerInfo.multiaddrs[0]
    const addressToSend = peerAddress + '/p2p/' + peerId
    await nodes[0].createAndSendMessage(addressToSend, meshProtocol, 'HI', (message) => {logger.log('ACK RESP', message)})*/
    // await setTimeout(10)
  })

  //fixme: to be implemented
  it.skip('should not allow to connect a node if not approved', async () => {
    const [node1, node2] = await startNetworkNodes(2)
    node1.connect(node2.peerId)
    await setTimeout(10)
    expect(node2.peers.length).toEqual(0)
    expect(node1.peers.length).toEqual(0)

    node1.addToKnownPeers(node2.peerId)
    node1.connect(node2.peerId)
    await setTimeout(10)
    expect(node1.peers.length).toEqual(1)
    expect(node2.peers.length).toEqual(1)
  })

  it('should get public key from peerId', async () => {
    const {pubKey, id} = peerIdJsons[0]
    const peerId = peerIdFromString(id)
    expect(uint8ArrayToString(peerId.publicKey, 'base64')).toEqual(pubKey)
  })

  it('message encryption and decryption', async () => {
    async function createSharedSecret(privateKey, publicKey) {
      return x25519.getSharedSecret(
        edwardsToMontgomeryPriv((await unmarshalPrivateKey(privateKey))._key),
        edwardsToMontgomeryPub((await unmarshalPublicKey(publicKey))._key))
    }

    function encrypt(message, secretKey) {
      const aes = new AesEncryption()
      aes.setSecretKey(secretKey)
      return aes.encrypt(message)
    }

    function decrypt(encrypted, secretKey) {
      const aes = new AesEncryption()
      aes.setSecretKey(secretKey)
      return aes.decrypt(encrypted)
    }

    const {publicKey: publicKey1, privateKey: privateKey1} = await createFromJSON(peerIdJsons[1])
    const {publicKey: publicKey2, privateKey: privateKey2} = await createFromJSON(peerIdJsons[2])
    const secret = await createSharedSecret(privateKey1, publicKey2)
    expect(secret).toEqual(await createSharedSecret(privateKey2, publicKey1))
    for (const each of ['hello world', 'hello world2', 'jqiweuouqwoeuopqweopiqwoeiwqoiepqwiepiqwpoei']) {
      const encrypted = encrypt(each, uint8ArrayToString(secret, 'hex'))
      const decrypted = decrypt(encrypted, uint8ArrayToString(secret, 'hex'))
      expect(decrypted).toEqual(each)
    }
  })
})
