import {expect} from 'expect'
import {ethers} from 'ethers' 
import BlockchainNode from '../src/BlockchainNode.js'
import {deployContract, getSigners, createDkgMembers, signMessage} from './help/index.js'
import {peerIdJsons} from './help/fixtures.js'
import {setTimeout} from 'node:timers/promises'

describe('blockchain.node', function () {
  let gluonL1Contract, gluonL2Contract, owner, anyone

  beforeEach(async () => {
    [owner, anyone] = await getSigners()
    gluonL1Contract = await deployContract('GluonL1', [])
    gluonL2Contract = await deployContract('GluonL2', [])
  })

  //leader node will listen on Deposit, and broadcast to children. Children will verify and sign and point-2-point update
  //the leader. Once M-of-N have signed, Leader will submit aggregate signature alongwith transaction instruction to contract
  //Leader address can be published in a smart contract or some other decentralized place for global discovery ?
  it('it should start blockchain node and process Deposits', async function () {
    const leader = new BlockchainNode({ip: '127.0.0.1',port:9000,isLeader: true, peerIdJson: peerIdJsons[0]});
    await leader.create().then(_ => _.start())
    const depositReceipts = {} 
    for (let i = 1; i<4; i++){
        const child = new BlockchainNode({isLeader: false, ip: '127.0.0.1',port:9000+i, peerIdJson: peerIdJsons[i]});
        await child.create().then(_ => _.start())
        await child.connect(leader.multiaddrs[0])
        await child.connectPubSub(
          leader.peerId,
          ({peerId, topic, data}) => {(topic === 'DepositHash') && (depositReceipts[child.peerId] = data)} //enhance this function to verify the hash using ethers
        )
        await child.subscribe('DepositHash')
    }
    await setTimeout(100)
    //This will come from blockchain event listener. ethers fn
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

  
})
