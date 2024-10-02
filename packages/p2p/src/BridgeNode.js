import {affirm, logger, until} from '@leverj/common'
import {
  deserializeHexStrToPublicKey,
  deserializeHexStrToSignature,
  G1ToNumbers,
  G2ToNumbers,
  SecretKey,
} from '@leverj/reactor.mcl'
import {stubs} from '@leverj/reactor.chain/contracts'
import {CrossChainVaultCoordinator, NetworkNode, TssNode} from '@leverj/reactor.p2p'
import {JsonRpcProvider} from 'ethers'
import {Map} from 'immutable'
import {setTimeout} from 'node:timers/promises'
import {topics} from './topics.js'
import {events, NODE_STATE_CHANGED, PEER_DISCOVERY, waitToSync} from './utils.js'

const meshProtocol = '/bridge/0.0.1'

export class BridgeNode {
  static async from(config, port, bootstrapNodes, data = {}) {
    const {p2p, tssNode, whitelist, leader} = data
    const network = await NetworkNode.from(config, port, p2p, bootstrapNodes)
    const tss = new TssNode(network.peerId, tssNode)
    tss.addMember(tss.idHex, _ => tss.onDkgShare(_)) // making self dkg share
    return new this(config, network, tss,  new Whitelist(whitelist || []), leader, bootstrapNodes.length === 0)
  }

  constructor(config, network, tss, whitelist, leader, isLeader) {
    this.config = config
    this.network = network
    this.tss = tss
    this.whitelist = whitelist
    this.leader = leader
    this.vaults = Map().asMutable()
    this.monitor = new Monitor()
    this.network.registerStreamHandler(meshProtocol, this.onStreamMessage.bind(this))
    this.whitelistPeers(...this.whitelist.initial)
    this.leadership = isLeader ? new Leader(this) : new Follower(this)
  }
  get multiaddrs() { return this.network.multiaddrs }
  get peerId() { return this.network.peerId }
  get peers() { return this.network.peers }
  get signer() { return this.tss.idHex }
  get secretKeyShare() { return this.tss.secretKeyShare?.serializeToHexStr() }
  get groupPublicKey() { return this.tss.groupPublicKey?.serializeToHexStr() }
  get isLeader() { return this.leadership.isLeader }

  addVault(chainId, vault) { this.vaults.set(chainId, vault) }

  state() {
    return {
      p2p: this.network.state(),
      tssNode: this.tss.state(),
      whitelist: this.whitelist.get(),
      leader: this.leader,
    }
  }

  async start() {
    await this.network.start()
    await this.leadership.addLeader()
    events.emit(NODE_STATE_CHANGED) //fixme: add leader to event?
    this.ping()
  }

  async stop() { return this.network.stop() }

  async connect(peerId) { return this.network.connect(peerId) }

  async ping() {
    const peerIds = this.whitelist.get()
    for (let each of peerIds) if (each !== this.peerId) {
      this.monitor.updateLatency(each, await this.network.ping(each))
      await setTimeout(this.config.timeout)
    }
    setTimeout(this.config.timeout).then(_ => this.ping())
  }

  whitelistPeers(...peerIds) {
    if (peerIds.length > 0) {
      for (let each of peerIds) {
        const dkgId = this.whitelist.add(each)
        if (each !== this.peerId) this.tss.addMember(dkgId, _ => this.sendMessageTo(each, topics.DKG_RECEIVE_SHARE, _))
      }
      logger.log('Added to whitelist', peerIds.map(_ => `${_.slice(0, 4)}..${_.slice(-3)}`).join(', '))
      events.emit(NODE_STATE_CHANGED) //fixme: add peerIds to event?
    }
  }

  async sendMessageTo(peerId, topic, message) {
    const responseHandler = _ => logger.log(`${topic} response from ${peerId} `, _)
    await this.network.sendMessageTo(peerId, meshProtocol, JSON.stringify({topic, message}), responseHandler)
  }

  async onStreamMessage(stream, peerId, payload) {
    const {topic, message} = JSON.parse(payload)
    affirm(this.whitelist.exists(peerId, `Unknown peer ${peerId}`))
    switch (topic) {
      case topics.WHITELIST: return this.onWhitelist(peerId, message)
      case topics.WHITELIST_REQUEST: return this.onWhitelistRequest(peerId)
      case topics.VAULT: return this.onVault(peerId, message)
      case topics.SIGNATURE_START: return this.onSignatureStart(peerId, message)
      case topics.SIGNATURE_RECEIVE_SHARE: return this.onSignatureShare(message)
      case topics.DKG_START: return this.onDkgStart(message)
      case topics.DKG_RECEIVE_SHARE: return this.onDkgShare(message)
      default: logger.log('Unknown message', message)
    }
  }

  onWhitelist(peerId, peerIds) {
    if (peerId !== this.leader) return logger.log(`ignoring ${topics.WHITELIST} from non-leader`, peerId)

    this.whitelistPeers(...peerIds)
  }

  onWhitelistRequest(peerId) {
    return this.whitelist.canPublish ? this.sendMessageTo(peerId, topics.WHITELIST, this.whitelist.get()) : {}
  }

  onVault(peerId, message) {
    if (peerId !== this.leader) return logger.log(`ignoring ${topics.VAULT} from non-leader`, peerId)

    const {chainId, address, providerURL} = message
    const vault = stubs.Vault(address, new JsonRpcProvider(providerURL))
    this.addVault(BigInt(chainId), vault)
  }

  async onSignatureStart(peerId, message) {
    if (peerId !== this.leader) return logger.log(`ignoring ${topics.SIGNATURE_START} from non-leader`, peerId)

    const {transferHash, from} = message
    const {vaults, signer, tss} = this
    if (await vaults.get(BigInt(from)).sends(transferHash)) {
      const signature = tss.sign(transferHash).serializeToHexStr()
      logger.log(topics.SIGNATURE_START, transferHash, signature)
      const message = {signature, signer, transferHash}
      await this.sendMessageTo(peerId, topics.SIGNATURE_RECEIVE_SHARE, message)
    }
  }

  async onSignatureShare(message) { return this.leadership.onSignatureShare(message) }

  onDkgStart(message) { this.tss.onDkgStart(message) }

  onDkgShare(message) { this.tss.onDkgShare(message) }
}

class Leader {
  constructor(self) {
    this.self = self
    this.isLeader = true
    this.aggregateSignatures = {}
    events.on(PEER_DISCOVERY, _ => this.self.whitelistPeers(_))
  }
  get publicKey() { return this.self.groupPublicKey ? G2ToNumbers(deserializeHexStrToPublicKey(this.self.groupPublicKey)) : undefined }
  get vaults() { return this.self.vaults }

  setupCoordinator(store, polling, wallet) {
    const {self} = this
    this.coordinator = new CrossChainVaultCoordinator(self.vaults, store, polling, this, wallet, self.logger)
    this.coordinator.start().catch(self.logger.error)
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

  async establishVaults(networks) {
    const {self} = this
    const message = {networks}
    self.onVaults(self.peerId, message) // fan to self
    await this.fanout(topics.VAULT, {networks})
  }

  async fanout(topic, message) {
    const {self} = this
    const {monitor, whitelist, peerId} = self
    const peerIds = monitor.filter(whitelist.get()).filter(_ => _ !== peerId)
    for (let each of peerIds) await self.sendMessageTo(each, topic, message)
  }
}

class Follower {
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

class Whitelist {
  constructor(initial) {
    this.allowed = {}
    this.initial = initial
    this.canPublish = false
  }

  exists(peerId) { return this.allowed[peerId] }
  get() { return Object.keys(this.allowed) }
  add(peerId) {
    this.allowed[peerId] = new SecretKey().setHashOfString(peerId).serializeToHexStr()
    return this.allowed[peerId]
  }
}

class Monitor {
  constructor() { this.peers = {} }

  updateLatency(peerId, latency) {
    if (!this.peers[peerId]) this.peers[peerId] = {}
    this.peers[peerId].latency = latency
  }
  getPeersStatus() { return Object.entries(this.peers).map(([peerId, {latency}]) => ({peerId, latency})) }
  filter(peerIds) { return peerIds.filter(_ => this.peers[_]?.latency !== -1)}
}
