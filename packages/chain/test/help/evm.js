import {ETH} from '@leverj/common/utils'
import {ethers, network, web3} from '@leverj/chain-deployment'

export {network} from '@leverj/chain-deployment'


export const chainId = network.config.chainId
export const provider = ethers.provider

const sendAsync = (payload) => new Promise((resolve, reject) =>
  web3.currentProvider.send(payload, (err, _) => err ? reject(err) : resolve(provider.getBlock('latest').hash))
)

export const getBlockNumber = async () => provider.getBlock('latest').then(_ => (_.number))
export const getBlockTimestamp = async () => provider.getBlock('latest').then(_ => (_.timestamp))

export const getBalance = async (address) => provider.getBalance(address)
export const getTokenBalance = async (token, address) => token.balanceOf(address)
export const getEtherBalances = async (parties) => Promise.all(parties.map(_ => getBalance(_)))
export const getTokenBalances = async (token, parties) => Promise.all(parties.map(_ => token.balanceOf(_)))
export const balances = async (...tuples) => Promise.all(
  tuples.map(([token, address]) => token === ETH ? getBalance(address) : getTokenBalance(token, address))
)

export const sendEther = async (from, to, value) => provider.sendTransaction({from, to, value})
// const sendEther = async (from, to, value) => provider.broadcastTransaction({from, to, value})

export const mineUpTo = async (blockNumber) => {
  const diff = blockNumber - await getBlockNumber()
  if (diff > 0) await mine(diff)
}
export const mineTillAfter = async (blockNumber) => {
  await mineUpTo(blockNumber)
  await mine(1) // now we are right after blockNumber
}
const mine = async (howManyBlocks = 1) => { for (let i = 0; i < howManyBlocks; i++) await sendAsync({method: 'evm_mine'}) }

export const increaseTime = async (duration) => sendAsync({method: 'evm_increaseTime', params: [duration]}).then(_ => mine())

export const setTime = async (time) => sendAsync({method: 'evm_mine', params: [time]})

