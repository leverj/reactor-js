import {JsonStore, logger, until} from '@leverj/common'
import {
  deserializeHexStrToPublicKey,
  deserializeHexStrToSignature,
  G1ToNumbers,
  G2ToNumbers,
} from '@leverj/reactor.mcl'
import {stubs} from '@leverj/reactor.chain/contracts'
import {CrossChainVaultCoordinator} from '@leverj/reactor.p2p'
import {JsonRpcProvider} from 'ethers'
import {topics} from './topics.js'
import {events, PEER_DISCOVERY, waitToSync} from './utils.js'

export class Leader {
  constructor(self) {
    this.self = self
    this.isLeader = true
    this.aggregateSignatures = {}
    events.on(PEER_DISCOVERY, _ => this.self.whitelistPeers(_))
  }
  get groupPublicKey() { return this.self.groupPublicKey }
  get publicKey() { return this.groupPublicKey ? G2ToNumbers(deserializeHexStrToPublicKey(this.groupPublicKey)) : undefined }
  get vaults() { return this.self.vaults }

  setupCoordinator(wallet, store) {
    const {self} = this
    const {bridge: {nodesDir}, chain: {polling}} = self.config
    this.coordinator = new CrossChainVaultCoordinator(self.vaults, store || new JsonStore(nodesDir, 'trackers'), polling, this, wallet)
    this.coordinator.start().catch(logger.error)
  }

  async addLeader() {
    const {self} = this
    self.leader = self.peerId
    self.whitelistPeers(self.leader)
  }

  async sign(from, transferHash) {
    const {self, aggregateSignatures} = this
    if (!self.vaults.has(from)) throw Error(`missing vault for chain ${from}`)
    aggregateSignatures[transferHash] = {
      signatures: [],
      verified: false,
    }
    const signature = self.tss.sign(transferHash).serializeToHexStr()
    const signer = self.signer
    await this.onSignatureShare({transferHash, signature, signer}) // fan to self
    await this.fanout(topics.SIGNATURE_START, {transferHash, from})
    const interval = 10, timeout = self.config.timeout //fixme:config: these should come from config
    await until(() => aggregateSignatures[transferHash].verified, interval, timeout)
    return aggregateSignatures[transferHash].verified ?
      G1ToNumbers(deserializeHexStrToSignature(aggregateSignatures[transferHash].groupSign)) :
      undefined
  }

  async onSignatureShare(message) {
    const {transferHash, signature, signer} = message
    const aggregateSignature = this.aggregateSignatures[transferHash]
    aggregateSignature.signatures.push({signature, signer})
    logger.log('Received signature', transferHash, signature)
    const {self} = this
    if (aggregateSignature.signatures.length === self.tss.threshold) {
      aggregateSignature.groupSign = self.tss.groupSign(aggregateSignature.signatures)
      aggregateSignature.verified = self.tss.verify(aggregateSignature.groupSign, transferHash)
      logger.log('Verified', transferHash, aggregateSignature.verified, aggregateSignature.groupSign)
    }
  }

  async establishWhitelist() {
    const {self} = this
    self.whitelist.canPublish = true
    self.onWhitelist(self.peerId, self.whitelist.get()) // fan to self
    await this.fanout(topics.WHITELIST, self.whitelist.get())
  }

  async establishGroupPublicKey(threshold) {
    const {self} = this, message = {threshold}
    self.onDkgStart(message) // fan to self
    await this.fanout(topics.DKG_START, message)
    //fixme: can we detect dkgDone and establish coordinator here?
  }

  async addVault(chainId, address, providerURL) {
    const {self} = this, message = {chainId, address, providerURL}
    self.onVault(self.peerId, message) // fan to self
    await this.fanout(topics.VAULT, message)

    const vault = stubs.Vault(address, new JsonRpcProvider(providerURL))
    this.coordinator.addVault(BigInt(chainId), vault)
  }

  async fanout(topic, message) {
    const {self} = this
    const {monitor, whitelist, peerId} = self
    const peerIds = monitor.filter(whitelist.get()).filter(_ => _ !== peerId)
    for (let each of peerIds) await self.sendMessageTo(each, topic, message)
  }

  stop() { this.coordinator?.stop() }
}

export class Follower {
  constructor(self) {
    this.self = self
    this.isLeader = false
  }

  async addLeader() {
    const {self} = this
    self.leader = self.network.bootstrapNodes[0].split('/').pop()
    self.whitelistPeers(self.leader)
    await waitToSync([_ => self.peers.includes(self.leader)], -1, self.config.timeout, self.config.port)
    await self.sendMessageTo(self.leader, topics.WHITELIST_REQUEST, '')
  }

  async onSignatureShare(message) { /* do nothing */ }
}
