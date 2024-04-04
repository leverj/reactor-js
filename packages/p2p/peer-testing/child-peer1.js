import Node from '../src/Node.js'

const peerIdJson = {
  privKey: 'CAESQGOEED1xY75lT0dqKQ1py7iYryEd1OB+l+6Co1XvUYgVV/OuL7KfE2VGxFOxmbkOyjcVdGp3otRdTnKXWvF4OBc',
  pubKey: 'CAESIFfzri+ynxNlRsRTsZm5Dso3FXRqd6LUXU5yl1rxeDgX',
  id: '12D3KooWFjh9hF2Hnj5ctFDxhz2N2zFin3Wc3P9umGWogMycKme6'
}
const leaderPeerId = '12D3KooWRRqAo5f41sQmc9BpsfqarZgd7PWUiX14Mz1htXDEc7Gp'
const leaderMuladdr = `/ip4/51.159.143.255/tcp/8080/p2p/${leaderPeerId}`

const node = await new Node({ip: '0.0.0.0', port: 8081, isLeader: true, peerIdJson}).create()
await node.start()
await node.connect(leaderMuladdr)

await node.connectPubSub(leaderPeerId, (peerId, topic, data) => console.log(peerId, topic, data))
await node.subscribe('DepositHash')
