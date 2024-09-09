export {ZeroAddress as ETH} from 'ethers'

export const getCreationBlock = async (provider, address, fromBlock = 0, toBlock) => {
  if (!toBlock) toBlock = await provider.getBlockNumber()

  if (fromBlock === toBlock) return fromBlock

  const midway = Math.floor((fromBlock + toBlock) / 2)
  const code = await provider.getCode(address, midway)
  return code.length > 2 ?
    getCreationBlock(provider, address, fromBlock, midway) :
    getCreationBlock(provider, address, midway + 1, toBlock)
}
