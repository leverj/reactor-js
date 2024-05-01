import { NetworkNode } from '../src/NetworkNode.js'
const peerIdJson  = {
  privKey: 'CAESQHOTa7HhPhxUrvmHmh5LX7jbz+CKW0ou7y39sGp45cw7pYUGS7JDh8RGeWhR8URX7UqV444+Uxk/swNGSAUkNto',
  pubKey: 'CAESIKWFBkuyQ4fERnloUfFEV+1KleOOPlMZP7MDRkgFJDba',
  id: '12D3KooWLxV5yTWvS2TbgukqBRQLvWSvSrtrciw3TQBuvhJwieMw'
}

const leaderMuladdr = '/ip4/51.159.143.255/tcp/8080/p2p/12D3KooWRRqAo5f41sQmc9BpsfqarZgd7PWUiX14Mz1htXDEc7Gp'
const node = await new Node({ip: '0.0.0.0', port: 8082, isLeader: true, peerIdJson}).create()
await node.start()
await node.connect(leaderMuladdr)
