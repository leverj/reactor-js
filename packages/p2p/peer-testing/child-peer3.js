import { Node } from '../src/Node.js'
const peerIdJson  = {
  privKey: 'CAESQFXP6qXikupDds5pFMFpqHMcB3d0O3JZ96Kvu21w8GzZtxZ0sAfRFUUN9L9Jb1tQpkPeg/OJML+hdZtQt7h3ddk',
  pubKey: 'CAESILcWdLAH0RVFDfS/SW9bUKZD3oPziTC/oXWbULe4d3XZ',
  id: '12D3KooWN94dvv9FVczTcrCf5PfM9RxRYaY7k1UYvRzq3W8gmZ7E'
}

const leaderMuladdr = '/ip4/51.159.143.255/tcp/8080/p2p/12D3KooWRRqAo5f41sQmc9BpsfqarZgd7PWUiX14Mz1htXDEc7Gp'
// const node = await new Node({ip: '51.15.25.144', port: 8082, isLeader: true, peerIdJson}).create()
const node = await new Node({ip: '0.0.0.0', port: 8083, isLeader: true, peerIdJson}).create()
await node.start()
await node.connect(leaderMuladdr)

