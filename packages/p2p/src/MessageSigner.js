import {G1ToNumbers, G2ToNumbers, sign} from '@leverj/reactor.mcl'

export class MessageSigner {
  constructor(signer) {
    this.signer = signer
  }

  async sign(message) {
    return {
      signature: G1ToNumbers(sign(message, this.signer.secret).signature),
      publicKey: G2ToNumbers(this.signer.pubkey),
    }
  }
}
