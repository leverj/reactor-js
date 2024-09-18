import {Deploy} from '@leverj/chain-deployment'
import {JsonStore, logger} from '@leverj/common'
import {configure} from '@leverj/config'
import * as reactor_chain_config from '@leverj/reactor.chain/config.schema'
import {JsonRpcProvider} from 'ethers'
import {Map} from 'immutable'
import {merge, zip} from 'lodash-es'
import {exec} from 'node:child_process'
import {readFileSync, rmSync, writeFileSync} from 'node:fs'
import waitOn from 'wait-on'

/*** manufacture a config just like the one in @leverj/reactor.chain ***/
export const createChainConfig = async (chains) => {
  const postLoad = (config) => {
    config = reactor_chain_config.postLoad(config)
    merge(config.contracts, Map(config.networks).map(({id, label}) => ({
      ERC20Mock: {
        params: [`Gold-${label}`, `💰-${id}`],
      },
    })).toJS())
    return config
  }
  // override chain/config/env with ^^^ chains
  const env = process.env.NODE_ENV
  const chain_dir = `${import.meta.dirname}/../../../chain`
  const config_file = `${chain_dir}/config/${env}.js`
  const override_file = `${chain_dir}/config/local-${env}.js`
  const override = `$1${chains.map(_ => `'${_}'`)}$3`
  writeFileSync(override_file, readFileSync(config_file, 'utf8').replace(/(.*chains:\s*\[)(.+)(].*)/, override))
  const config = await configure(reactor_chain_config.schema, postLoad, {env: {PWD: chain_dir, NODE_ENV: env}})
  rmSync(override_file)
  return config
}

export const launchEvms = async (config, forked = false) => {
  const {chains, networks} = config
  const deploy = Deploy.from(config, logger)
  const ports = chains.map((chain, i) => 8101 + i)
  const providerURLs = ports.map(port => `http://localhost:${port}`)
  zip(chains, providerURLs).forEach(([chain, providerURL]) => networks[chain].providerURL = providerURL)
  const processes = zip(chains, ports).map(([chain, port]) => launchEvm(networks, chain, port, forked))
  for (let [chain, providerURL] of zip(chains, providerURLs)) {
    await waitOn({resources: [providerURL], timeout: 10_000})
    await deploy.to(chain, {reset: true})
  }
  return processes
}

const launchEvm = (networks, chain, port, forked = false) => {
  const dir = `${import.meta.dirname}/hardhat/${forked ? 'forked' : 'nascent'}/${networks[chain].testnet ? 'testnets' : 'mainnets'}`
  const process = exec(`npx hardhat node --config ${dir}/${chain}.config.cjs --port ${port}`)
  process.stdout.on('data', logger.log)
  return process
}

export const getEvmsStore = (path) => new JsonStore(path, '.evms')

export const getDeployedNetworks = (path) => Map(getEvmsStore(path).toObject()).map(_ => ({
  id: BigInt(_.id),
  label: _.label,
  nativeCurrency: _.nativeCurrency,
  provider: new JsonRpcProvider(_.providerURL),
  Vault: _.contracts.Vault,
})).valueSeq().toArray()
