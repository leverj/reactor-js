import {Deploy, networks, wallets} from '@leverj/chain-deployment'
import {logger} from '@leverj/common'
import {publicKey} from '@leverj/reactor.chain/test'
import {exec, spawn} from 'child_process'
import {Map} from 'immutable'
import {cloneDeep, merge} from 'lodash-es'
import {rmSync} from 'node:fs'
import waitOn from 'wait-on'
import {BridgeNode} from '../src/BridgeNode.js'
import config from '../config.js'
import {peerIdJsons} from './fixtures.js'

const {bridge: {confDir}} = config

export const deploymentDir = `${import.meta.dirname}/../../../data/chain`

export const launchEvm = (config, port) => {
  const {networks, chain} = config
  const hardhatConfigFileFor = `test/hardhat/${networks[chain].testnet ? 'nascent/testnets' : 'forked/mainnets'}/${chain}.config.cjs`
  const command = `npx hardhat node --config ${hardhatConfigFileFor} --port ${port}`
  return exec(command)
}
export const launchGanacheEvm = (config, port) => {
  const {networks, chain} = config
  const command = `npx ganache-cli --fork ${networks[chain].providerUrl}  --port ${port}`
  // return exec(command)
  const args = command.split(' ')
  return spawn(args.shift(), args, {detached: true})
}

export const launchEvms = async (chains) => {
  const processes = []
  rmSync(confDir, {recursive: true, force: true})
  const configs = []
  for (let [i, chain] of chains.entries()) {
    const port = 8101 + i
    const config = createDeployConfig(chain, chains, {providerURL: `http://localhost:${port}`})
    processes.push(launchEvm(config, port))
    configs.push(config)
  }
  for (let config of configs) {
    await waitOn({resources: [config.networks[config.chain].providerURL], timeout: 10_000})
    await Deploy.from(config, {logger}).run()
  }
  return processes
}

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
