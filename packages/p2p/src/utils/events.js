import {EventEmitter} from 'node:events'

const events = new EventEmitter()
export default events
export const INFO_CHANGED = 'INFO_CHANGED'
export const PEER_DISCOVERY = 'peer:discovery'
export const PEER_CONNECT = 'peer:connect'
