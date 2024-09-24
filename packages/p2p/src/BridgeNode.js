import {affirm, logger, until} from '@leverj/common'
import {
  deserializeHexStrToPublicKey,
  deserializeHexStrToSignature,
  G1ToNumbers,
  G2ToNumbers,
  SecretKey,
} from '@leverj/reactor.mcl'
import {NetworkNode, TssNode} from '@leverj/reactor.p2p'
import {setTimeout} from 'node:timers/promises'
import {events, NODE_INFO_CHANGED, PEER_DISCOVERY, waitToSync} from './utils.js'

const TSS_RECEIVE_SIGNATURE_SHARE = 'TSS_RECEIVE_SIGNATURE_SHARE'
const SIGNATURE_START = 'SIGNATURE_START'
const WHITELIST = 'WHITELIST'
const WHITELIST_REQUEST = 'WHITELIST_REQUEST'
const DKG_INIT_THRESHOLD_VECTORS = 'DKG_INIT_THRESHOLD_VECTORS'
const DKG_RECEIVE_KEY_SHARE = 'DKG_RECEIVE_KEY_SHARE'
const meshProtocol = '/bridge/0.0.1'

export class BridgeNode {
  static async from(config, port, bootstrapNodes, data = {}) {
    const {p2p, tssNode, whitelist, leader} = data
    const network = await NetworkNode.from(config, port, p2p, bootstrapNodes)
    const tss = new TssNode(network.peerId, tssNode)
    tss.addMember(tss.idHex, tss.onDkgShare.bind(tss)) // making self dkg share
    return new this(config, network, tss,  new Whitelist(whitelist || []), leader, bootstrapNodes.length === 0)
  }

  constructor(config, network, tss, whitelist, leader, isLeader) {
    this.config = config
    this.network = network
    this.tss = tss
    this.whitelist = whitelist
    this.leader = leader
    this.leadership = isLeader ? new Leader(this) : new Follower(this)
    this.aggregateSignatures = {}
    this.vaults = {}
    this.monitor = new Monitor()
    this.network.registerStreamHandler(meshProtocol, this.onStreamMessage.bind(this))
    this.whitelistPeers(...this.whitelist.initial)
    this.leadership.listenToPeerDiscovery()
  }

  get multiaddrs() { return this.network.multiaddrs }
  get peerId() { return this.network.peerId }
  get peers() { return this.network.peers }
  get signer() { return this.tss.idHex }
  get secretKeyShare() { return this.tss.secretKeyShare.serializeToHexStr() }
  get groupPublicKey() { return this.tss.groupPublicKey.serializeToHexStr() }
  get publicKey() { return G2ToNumbers(deserializeHexStrToPublicKey(this.groupPublicKey)) }
  get isLeader() { return this.leadership.isLeader }

  async onVaultTransferEvent(from, transferHash) { return this.leadership.onVaultTransferEvent(from, transferHash) }
  async aggregateSignature(from, transferHash) { return this.leadership.aggregateSignature(from, transferHash) }
  async publishWhitelist() { return this.leadership.publishWhitelist() }
  async startDKG(threshold) { return this.leadership.startDKG(threshold) }

  getAggregateSignature(transferHash) { return this.aggregateSignatures[transferHash] }

  setVaultForChain(chainId, vault) { this.vaults[chainId] = vault }

  print() { this.tss.print() }

  info() {
    return {
      p2p: this.network.info(),
      tssNode: this.tss.info(),
      whitelist: this.whitelist.get(),
      leader: this.leader,
    }
  }

  async start() {
    await this.network.start()
    await this.leadership.addLeader()
    events.emit(NODE_INFO_CHANGED)
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
    setTimeout(this.config.timeout).then(this.ping.bind(this))
  }

  whitelistPeers(...peerIds) {
    if (peerIds.length > 0) {
      for (let each of peerIds) {
        const dkgId = this.whitelist.add(each)
        if (each !== this.peerId) this.tss.addMember(dkgId, this.sendMessageTo.bind(this, each, DKG_RECEIVE_KEY_SHARE))
      }
      logger.log('Added to whitelist', peerIds.map(_ => `${_.slice(0, 4)}..${_.slice(-3)}`).join(', '))
      events.emit(NODE_INFO_CHANGED)
    }
  }

  async sendMessageTo(peerId, topic, message) {
    const responseHandler = _ => logger.log(`${topic} response from ${peerId} `, _)
    await this.network.sendMessageTo(peerId, meshProtocol, JSON.stringify({topic, message}), responseHandler)
  }

  async connectPubSub(peerId) {
    return this.network.connectPubSub(peerId, this.onPubSubMessage.bind(this))
  }

  async onPubSubMessage({peerId, topic, data}) {
    switch (topic) {
      case WHITELIST: return this.handleWhitelist(peerId, JSON.parse(data))
      case SIGNATURE_START: return this.handleSignatureStart(peerId, JSON.parse(data))
      default: logger.log('Unknown topic', topic)
    }
  }

  async onStreamMessage(stream, peerId, payload) {
    const message = JSON.parse(payload)
    affirm(this.whitelist.exists(peerId, `Unknown peer ${peerId}`))
    switch (message.topic) {
      case WHITELIST: return this.handleWhitelist(peerId, message.message)
      case WHITELIST_REQUEST: return this.handleWhitelistRequest(peerId)
      case SIGNATURE_START: return this.handleSignatureStart(peerId, JSON.parse(message.message))
      case TSS_RECEIVE_SIGNATURE_SHARE: return this.handleSignatureShare(message)
      case DKG_INIT_THRESHOLD_VECTORS: return this.tss.generateVectorsAndContribution(message.threshold)
      case DKG_RECEIVE_KEY_SHARE: return this.tss.onDkgShare(message.message)
      default: logger.log('Unknown message', message)
    }
  }

  handleWhitelist(peerId, peerIds) {
    this.leader === peerId ?
      this.whitelistPeers(...peerIds) :
      logger.log('ignoring whitelist from non-leader', peerId)
  }

  handleWhitelistRequest(peerId) {
    return this.whitelist.canPublish ? this.sendMessageTo(peerId, WHITELIST, this.whitelist.get()) : {}
  }

  async handleSignatureStart(peerId, data) {
    if (this.leader === peerId) {
      const {transferHash, from} = data
      if (await this.vaults[from].sends(transferHash)) {
        const signature = this.tss.sign(transferHash).serializeToHexStr()
        logger.log(SIGNATURE_START, transferHash, signature)
        const signaturePayloadToLeader = {
          topic: TSS_RECEIVE_SIGNATURE_SHARE,
          signature,
          signer: this.signer,
          transferHash,
        }
        await this.network.sendMessageTo(peerId, meshProtocol, JSON.stringify(signaturePayloadToLeader), _ => logger.log('SignaruePayload Ack', _))
      }
    }
  }

  async handleSignatureShare(message) {
    const {transferHash, signature, signer} = message
    const info = this.aggregateSignatures[transferHash]
    info.signatures.push({signature, signer})
    logger.log('Received signature', transferHash, signature)
    if (info.signatures.length === this.tss.threshold) {
      info.groupSign = this.tss.groupSign(info.signatures)
      info.verified = this.tss.verify(info.groupSign, transferHash)
      logger.log('Verified', transferHash, info.verified, info.groupSign)
    }
  }
}

class Leader {
  constructor(self) { this.self = self}

  async addLeader() {
    this.self.leader = this.self.peerId
    this.self.whitelistPeers(this.self.leader)
  }
  get isLeader() { return true }

  listenToPeerDiscovery() { events.on(PEER_DISCOVERY, _ => this.self.whitelistPeers(_)) }

  async onVaultTransferEvent(from, transferHash) {
    if (await this.self.vaults[from].sends(transferHash)) return this.aggregateSignature(from, transferHash)
  }

  async aggregateSignature(from, transferHash) {
    const {vaults, signer, aggregateSignatures, tss, monitor, whitelist, config} = this.self
    if (await vaults[from].sends(transferHash)) {
      const signature = tss.sign(transferHash).serializeToHexStr()
      aggregateSignatures[transferHash] = {
        signatures: [{signer, signature}],
        transferHash,
        verified: false,
      }
      await this.fanout(SIGNATURE_START, JSON.stringify({transferHash, from}), monitor.filter(whitelist.get()))
      //fixme:config: these should come from config
      const interval = 10, timeout = 100 //config.timeout
      await until(() => aggregateSignatures[transferHash].verified, interval, timeout)
    }
    return aggregateSignatures[transferHash].verified ?
      G1ToNumbers(deserializeHexStrToSignature(aggregateSignatures[transferHash].groupSign)) :
      null
  }

  async publishWhitelist() {
    this.self.whitelist.canPublish = true
    const message = this.self.whitelist.get()
    await this.fanout(WHITELIST, message, this.self.monitor.filter(message))
  }

  async fanout(topic, message, peerIds) {
    for (let each of peerIds) if (each !== this.self.peerId) await this.self.sendMessageTo(each, topic, message)
  }

  async startDKG(threshold) {
    for (let each of this.self.whitelist.get()) if (each !== this.self.peerId) {
      const message = JSON.stringify({topic: DKG_INIT_THRESHOLD_VECTORS, threshold})
      await this.self.network.sendMessageTo(each, meshProtocol, message, _ => logger.log('dkg received', _))
    }
    await this.self.tss.generateVectorsAndContribution(threshold)
  }
}

class Follower {
  constructor(self) {
    this.self = self
  }
  get isLeader() { return false }

  async addLeader() {
    this.self.leader = this.self.network.bootstrapNodes[0].split('/').pop()
    this.self.whitelistPeers(this.self.leader)
    await waitToSync([_ => this.self.peers.includes(this.self.leader)], -1, this.self.config.timeout, this.self.config.port)
    await this.self.sendMessageTo(this.self.leader, WHITELIST_REQUEST, '')
  }
  listenToPeerDiscovery() {}
  async onVaultTransferEvent() { throw Error('illegal non-leader operation') }
  async aggregateSignature() { throw Error('illegal non-leader operation') }
  async publishWhitelist() { throw Error('illegal non-leader operation') }
  async startDKG() { throw Error('illegal non-leader operation') }
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
  print() { logger.table(this.peers) }
}
