import {G1ToNumbers, G2ToNumbers, newKeyPair, sign} from '@leverj/reactor.mcl'

export const signer = newKeyPair()
export const publicKey = G2ToNumbers(signer.pubkey)
export const signedBy = (message, signer) => G1ToNumbers(sign(message, signer.secret).signature)

export class InMemoryStore {
  constructor() { this.map = new Map() }
  get(key, defaults) { return this.map.get(key) || defaults }
  set(key, value) {this.map.set(key, value) }
  clear() { this.map.clear() }
}
