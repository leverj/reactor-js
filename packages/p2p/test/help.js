import {networks, wallets} from '@leverj/chain-deployment'
import {publicKey} from '@leverj/reactor.chain/test'
import {Map} from 'immutable'
import {cloneDeep, merge} from 'lodash-es'
import {BridgeNode} from '../src/BridgeNode.js'
import config from '../config.js'
import {peerIdJsons} from './fixtures.js'

export const deploymentDir = `${import.meta.dirname}/../../../data/chain`
export const hardhatConfigFileFor = ({networks, chain}) => `test/hardhat/${networks[chain].testnet ? 'testnets' : 'mainnets'}/${chain}.config.cjs`


export const createDeployConfig = (chain, chains, override = {}) => {
  return merge({
    env: process.env.NODE_ENV,
    chain,
    deploymentDir,
    deployer: {privateKey: wallets[0].privateKey},
    networks: Map(cloneDeep(networks)).filter(_ => chains.includes(_.label)).toJS(),
    contracts: Map(networks).map(({id, nativeCurrency: {name, symbol, decimals}}) => ({
      BnsVerifier: {},
      Vault: {
        libraries: ['BnsVerifier'],
        params: [id, name, symbol, decimals, publicKey],
      },
    })).toJS(),
  }, {networks: {[chain]: override}})
}

export const createBridgeNodes = async (howMany) => {
  const results = []
  const bootstrapNodes = []
  for (let i = 0; i < howMany; i++) {
    const data = {p2p: peerIdJsons[i]}
    const node = await BridgeNode.from(config.bridgeNode.port + i, bootstrapNodes, data)
    results.push(node)
    await node.start()
    if (i === 0) bootstrapNodes.push(node.multiaddrs[0])
  }
  return results
}

export class Chain {
  static async from(provider) {
    const {chainId, name} = await provider.getNetwork()
    return new this(chainId, name === 'unknown' ? 'hardhat' : name, provider)
  }

  constructor(id, label, provider) {
    this.id = id
    this.label = label
    this.provider = provider
  }
}
