import {defaults} from './defaults.js'

export default Object.assign(
  defaults,
  {
    chain: {
      polling: {
        interval: 10,
        attempts: 5,
      }
    }
  }
)
