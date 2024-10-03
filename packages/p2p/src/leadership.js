import {JsonStore, logger, until} from '@leverj/common'
import {
  deserializeHexStrToPublicKey,
  deserializeHexStrToSignature,
  G1ToNumbers,
  G2ToNumbers,
} from '@leverj/reactor.mcl'
import {stubs} from '@leverj/reactor.chain/contracts'
import {CrossChainVaultCoordinator} from '@leverj/reactor.p2p'
import {JsonRpcProvider, Wallet} from 'ethers'
import {DKG_DONE, events, PEER_DISCOVERY} from './events.js'
import {topics} from './topics.js'
import {waitToSync} from './utils.js'

export class Leader {
  constructor(self) {
    this.self = self
    this.isLeader = true
    this.aggregateSignatures = {}
    events.on(PEER_DISCOVERY, _ => this.self.whitelistPeers(_))
    events.on(DKG_DONE, _ => this.setupCoordinator(new JsonStore(this.self.config.bridge.nodesDir, 'trackers')))
  }
  get groupPublicKey() { return this.self.groupPublicKey }
  get publicKey() { return this.groupPublicKey ? G2ToNumbers(deserializeHexStrToPublicKey(this.groupPublicKey)) : undefined }
  get vaults() { return this.self.vaults }

  setupCoordinator(store) {
    if (this.coordinator) return
    const {self} = this
    const {chain: {tracker: {polling}, coordinator: {wallet: {privateKey}}}} = self.config
    const wallet = new Wallet(privateKey)
    this.coordinator = new CrossChainVaultCoordinator(self.vaults, store, polling, this, wallet)
    this.coordinator.start().catch(logger.error)
  }

  async start() {
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
    const {vaults, signer, tss} = self
    if (!await vaults.get(BigInt(from)).sends(transferHash)) return undefined
    const signature = tss.sign(transferHash).serializeToHexStr()
    await this.onSignatureShare({transferHash, signature, signer}) // fan to self
    await this.fanout(topics.SIGNATURE_START, {transferHash, from})
    const {interval, timeout} = self.config.messaging
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

  async stop() { return this.coordinator?.stop() }
}

export class Follower {
  constructor(self) {
    this.self = self
    this.isLeader = false
  }

  async start() {
    const {self} = this
    const {port, messaging: {timeout}} = self.config
    self.leader = self.network.bootstrapNodes[0].split('/').pop()
    self.whitelistPeers(self.leader)
    await waitToSync([_ => self.peers.includes(self.leader)], -1, timeout, port)
    await self.sendMessageTo(self.leader, topics.WHITELIST_REQUEST, '')
  }

  async onSignatureShare(message) { /* do nothing */ }

  async stop() { /* do nothing */ }
}
