import {G1ToNumbers, G2ToNumbers, newKeyPair, sign} from '@leverj/reactor.mcl'

export const signer = newKeyPair()
export const publicKey = G2ToNumbers(signer.pubkey)
export const signedBy = (message, signer) => G1ToNumbers(sign(message, signer.secret).signature)
