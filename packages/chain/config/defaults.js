import info from '../package.json' assert {type: 'json'}
import {wallets} from '@leverj/chain-deployment/test'

export const dataDir = `${import.meta.dirname}/../../../data`

export const defaults = {
  deployer: {
    privateKey: wallets[0].privateKey,
  },
  deploymentDir: `${dataDir}/${info.name}/chain`,
  vault: {
    publicKey: 'CAESIOf1KYYMB/P5g7E2vR3m6wbgyehLcTcJxAIxFcgPzkI1',
  },
}
