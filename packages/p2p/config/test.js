import {defaults} from './defaults.js'
import {wallets} from '@leverj/chain-deployment/hardhat.help'

export default Object.assign(
  defaults,
  {
    bridge: {
      threshold: 2,
    },
    messaging: {
      interval: 10,
    },
    chain: {
      coordinator: {
        wallet: {
          privateKey: wallets[0].privateKey,
        }
      },
      tracker: {
        polling: {
          attempts: 5,
          interval: 10,
        }
      }
    }
  }
)
