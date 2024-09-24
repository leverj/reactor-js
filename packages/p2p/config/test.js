import {defaults} from './defaults.js'

export default Object.assign(
  defaults,
  {
    bridge: {
      threshold: 2,
    },
    chain: {
      polling: {
        interval: 10,
        attempts: 5,
      }
    }
  }
)
