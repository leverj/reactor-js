import {deployContract} from './hardhat.cjs'
import BlockchainNode from '../../src/BlockchainNode.js'
import {bridgeInfos} from './fixtures.js'

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
    const node = BlockchainNode.fromConfiguredEvms({port: 9000 + i, isLeader: i === 0, json: bridgeInfos[i], provider, contractAddress, bootstrapNodes})
    await node.create()
    await node.start()
    if(i === 0) bootstrapNodes = node.multiaddrs
    nodes.push(node)
  }
  return nodes

}