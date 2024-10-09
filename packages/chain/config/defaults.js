import info from '../package.json' assert {type: 'json'}
import {wallets} from '@leverj/chain-deployment/hardhat.help'
import {last} from 'lodash-es'

export const dataDir = `${import.meta.dirname}/../../../data`
export const packageName = last(info.name.split('/'))

export const defaults = {
  deployer: {
    privateKey: wallets[0].privateKey,
  },
  deploymentDir: `${dataDir}/${packageName}`,
  vault: {
    publicKey: 'aaefd7f4788ba7f19e2d8be297f6ea91e04c850d16f80e08be4cb768d08f192a60afe4481f4f9cf8faac59ed801b1543ad491097be5d08235ea1298fed864720',
  },
}
