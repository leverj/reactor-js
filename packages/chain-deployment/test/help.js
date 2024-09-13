import {networks as NETWORKS, wallets} from '@leverj/chain-deployment'
import {Map} from 'immutable'

export const deploymentDir = `${import.meta.dirname}/../../../data/chain` //fixme: use project name

export const createConfig = (chains) => {
  const networks = Map(NETWORKS).filter(_ => chains.includes(_.label))
  return ({
    env: process.env.NODE_ENV,
    deploymentDir,
    deployer: {privateKey: wallets[0].privateKey},
    chains: networks.keySeq().toArray(),
    networks: networks.toJS(),
    contracts: networks.map(({chainId, name}) => ({
      Bank: {params: [chainId, name]},
    })).toJS(),
  })
}
