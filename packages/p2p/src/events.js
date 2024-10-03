import {EventEmitter} from 'node:events'

export const events = new EventEmitter()
export const NODE_STATE_CHANGED = 'node:state:changed'
export const PEER_DISCOVERY = 'peer:discovery'
export const PEER_CONNECT = 'peer:connect'
export const DKG_DONE = 'dkg:done'
