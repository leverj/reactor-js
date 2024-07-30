import {EventEmitter} from 'node:events'

export const events = new EventEmitter()
export const INFO_CHANGED = 'INFO_CHANGED'
export const PEER_DISCOVERY = 'peer:discovery'
export const PEER_CONNECT = 'peer:connect'
