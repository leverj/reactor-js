import {createProvider} from 'hardhat/internal/core/providers/construction.js'
import {EthersProviderWrapper} from '@nomiclabs/hardhat-ethers/internal/ethers-provider-wrapper.js'


const providers = {}

export default async function (hardhat, networkName) {
  if (!hardhat.config.networks[networkName]) throw new Error(`changeNetwork: Couldn't find network '${networkName}'`)
  if (!providers[hardhat.network.name]) providers[hardhat.network.name] = hardhat.network.provider
  if (!providers[networkName]) providers[networkName] = await createProvider(hardhat.config, networkName, hardhat.artifacts)
  hardhat.network.name = networkName
  hardhat.network.config = hardhat.config.networks[networkName]
  hardhat.network.provider = providers[networkName]
  if (hardhat.ethers) hardhat.ethers.provider = new EthersProviderWrapper(hardhat.network.provider)
}
