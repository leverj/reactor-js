import {merge} from 'lodash-es'
import {defaults} from './defaults.js'

export default merge(
  defaults,
  {
    chains: ['hardhat', 'localhost'],
  }
)
