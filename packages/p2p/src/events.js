import { EventEmitter } from 'node:events';
const events = new EventEmitter();
export default events;
export const INFO_CHANGED = 'INFO_CHANGED';
export const PEER_LATENCY = 'PEER_LATENCY';