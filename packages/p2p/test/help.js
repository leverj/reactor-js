import {Deploy, networks as NETWORKS, wallets} from '@leverj/chain-deployment'
import {logger} from '@leverj/common'
import {publicKey} from '@leverj/reactor.chain/test'
import {exec} from 'child_process'
import {Map} from 'immutable'
import {merge, zip} from 'lodash-es'
import {rmSync} from 'node:fs'
import waitOn from 'wait-on'
import {BridgeNode} from '../src/BridgeNode.js'
import config from '../config.js'
import {peerIdJsons} from './fixtures.js'

const {bridge: {confDir}} = config

export const deploymentDir = `${import.meta.dirname}/../../../data/chain`

// manufacture a config just like the one in @leverj/reactor.chain
export const createChainConfigWithoutChain = (chains) => {
  const networks = Map(NETWORKS).filter(_ => chains.includes(_.label))
  return ({
    env: process.env.NODE_ENV,
    deploymentDir,
    deployer: {privateKey: wallets[0].privateKey},
    vault: {publicKey},
    chains: networks.keySeq().toArray(),
    networks: networks.toJS(),
    contracts: networks.map(({id, nativeCurrency: {name, symbol, decimals}}) => ({
      BnsVerifier: {},
      Vault: {
        libraries: ['BnsVerifier'],
        params: [id, name, symbol, decimals, publicKey],
      },
    })).toJS(),
  })
}

export const launchEvms = async (chains, forked = false) => {
  rmSync(confDir, {recursive: true, force: true})
  const config = createChainConfigWithoutChain(chains)
  const ports = chains.map((chain, i) => 8101 + i)
  zip(chains, ports).forEach(([chain, port]) => config.networks[chain].providerURL = `http://localhost:${port}`)
  const processes = zip(chains, ports).map(([chain, port]) =>
    launchEvm(config.networks, chain, port, forked))
  for (let chain of chains) {
    await waitOn({resources: [config.networks[chain].providerURL], timeout: 10_000})
    const configWithChain = merge({}, config, {chain})
    await Deploy.from(configWithChain, {logger}).run()
  }
  return processes
}

const launchEvm = (networks, chain, port, forked = false) => {
  const dir = `${forked ? 'forked' : 'nascent'}/${networks[chain].testnet ? 'testnets' : 'mainnets'}`
  const hardhatConfigFileFor = `test/hardhat/${dir}/${chain}.config.cjs`
  return exec(`npx hardhat node --config ${hardhatConfigFileFor} --port ${port}`)
}
const launchGanacheEvm = (providerUrl, port) => exec(`npx ganache-cli --fork ${providerUrl}  --port ${port}`) //fixme: experimental

export const createBridgeNodes = async (howMany) => {
  const results = []
  const bootstrapNodes = []
  for (let i = 0; i < howMany; i++) {
    const data = {p2p: peerIdJsons[i]}
    const node = await BridgeNode.from(config.bridge.port + i, bootstrapNodes, data)
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
