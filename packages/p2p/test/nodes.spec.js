import {expect} from 'expect'
import Node from '../src/Node.js'

describe('p2p', function (){
  let node1, node2
  beforeEach(async function (){
    if(node1) await node1.stop()
    if(node2) await node2.stop()
  })
  afterEach(async function (){
    await node1.stop()
    await node2.stop()
  })
  it('should be able to create a node', async function (){
    node1 = await new Node(10001).create()
    await node1.start()
    node2 = await new Node(10002).create()
    await node2.start()
    console.log('node1:', node1.node.peerId.string)
    console.log('node2:', node2.node.peerId.string)
    expect(node1.node.peerId.string).not.toEqual(node2.node.string)
  })

  it('should be able to ping a node', async function (){
    node1 = await new Node(10001).create()
    await node1.start()
    node2 = await new Node(10002).create()
    await node2.start()
    await node1.ping(node2.multiaddrs[0])
  })

})
