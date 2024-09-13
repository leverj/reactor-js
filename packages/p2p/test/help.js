import info from '../package.json' assert {type: 'json'}
import {Deploy} from '@leverj/chain-deployment'
import {wallets} from '@leverj/chain-deployment/test'
import {logger} from '@leverj/common'
import * as reactor_chain_config from '@leverj/reactor.chain/config'
import {publicKey} from '@leverj/reactor.chain/test'
import {exec} from 'child_process'
import {zip} from 'lodash-es'
import waitOn from 'wait-on'
import {BridgeNode} from '../src/BridgeNode.js'
import config from '../config.js'
import {peerIdJsons} from './fixtures.js'

//fixme: how to make this work?
// export const createDeployConfig_2 = async (chains) => {
//   // override chain/config/env with ^^^ chains
//   const chain_config_dir = `${process.env.PWD}/../chain/config`
//   const config_file = `${chain_config_dir}/${env}.js`
//   const override_file = `${chain_config_dir}/local-${env}.js`
//   const regex = /(.*chains:\s*\[)(.+)(].*)/
//   const override = `$1${chains.map(_ => `'${_}'`)}$3`
//   writeFileSync(override_file, readFileSync(config_file, 'utf8').replace(regex, override))
//   const config = await import(`${chain_config_dir}.js`)
//   rmSync(override_file)
//   return config
// }

// manufacture a config just like the one in @leverj/reactor.chain
export const configureDeployment = (chains) => {
  const config = {
    env: process.env.NODE_ENV,
    deploymentDir: `${process.env.PWD}/../../data/${info.name}/chain`,
    deployer: {privateKey: wallets[0].privateKey},
    chains,
    vault: {publicKey},
  }
  return reactor_chain_config.postLoad(config)
}

export const launchEvms = async (config, forked = false) => {
  const {chains, networks} = config
  const deploy = Deploy.from(config, logger)
  const ports = chains.map((chain, i) => 8101 + i)
  zip(chains, ports).forEach(([chain, port]) => config.networks[chain].providerURL = `http://localhost:${port}`)
  const processes = zip(chains, ports).map(([chain, port]) => launchEvm(config.networks, chain, port, forked))
  for (let chain of chains) {
    await waitOn({resources: [networks[chain].providerURL], timeout: 10_000})
    await deploy.to(chain, {reset: true})
  }
  return {config, processes}
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
