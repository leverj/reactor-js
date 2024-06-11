import {deployContract} from './hardhat.cjs'
import BlockchainNode from '../../src/BlockchainNode.js'
import {bridgeInfos} from './fixtures.js'
import {setTimeout} from 'timers/promises'
export const nodes = []

export const stop = async () => {
  for (const node of nodes) await node.stop()
  nodes.length = 0
}

export const createContracts = async () => {
  const deposit = await deployContract('L1Deposit', [])
  return [deposit]
}

export const createNodes = async (count, provider, contractAddress) => {
  let bootstrapNodes = []
  for (let i = 0; i < count; i++) {
    // console.log('creating node', i, bootstrapNodes)
    const node = BlockchainNode.fromConfiguredEvms({port: 9000 + i, isLeader: i === 0, json: bridgeInfos[i], provider, contractAddress, bootstrapNodes})
    await node.create()
    await node.start()
    await setTimeout(100)
    if(i === 0) bootstrapNodes = node.multiaddrs
    nodes.push(node)
  }
  return nodes

}