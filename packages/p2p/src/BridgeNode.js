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
import {events, NODE_STATE_CHANGED, PEER_DISCOVERY, waitToSync} from './utils.js'

const meshProtocol = '/bridge/0.0.1'
const topics = {
  WHITELIST: 'whitelist',
  WHITELIST_REQUEST: 'whitelist:request',
  SIGNATURE_START: 'signature:start',
  SIGNATURE_RECEIVE_SHARE: 'signature:receive:share',
  DKG_START: 'dkg:start',
  DKG_RECEIVE_SHARE: 'dkg:receive:share',
}

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
  get secretKeyShare() { return this.tss.secretKeyShare?.serializeToHexStr() }
  get groupPublicKey() { return this.tss.groupPublicKey?.serializeToHexStr() }
  get publicKey() { return G2ToNumbers(deserializeHexStrToPublicKey(this.groupPublicKey)) }
  get isLeader() { return this.leadership.isLeader }

  setVaults(vaults) { this.vaults = vaults }

  async publishWhitelist() { return this.leadership.publishWhitelist() }
  async startDKG(threshold) { return this.leadership.startDKG(threshold) }
  async sign(from, transferHash) { return this.leadership.aggregateSignature(from, transferHash) }

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
    events.emit(NODE_STATE_CHANGED)
    this.ping()
  }

  async stop() { return this.network.stop() }

  async connect(peerId) { return this.network.connect(peerId) }

  async ping() {
    const peerIds = this.whitelist.get()
    for (let each of peerIds) if (each !== this.peerId) {
      this.monitor.updateLatency(each, await this.network.ping(each))
      await setTimeout(this.config.timeout) //fixme: why the timeout?
    }
    setTimeout(this.config.timeout).then(this.ping.bind(this)) //fixme: why the timeout?
  }

  whitelistPeers(...peerIds) {
    if (peerIds.length > 0) {
      for (let each of peerIds) {
        const dkgId = this.whitelist.add(each)
        if (each !== this.peerId) this.tss.addMember(dkgId, this.sendMessageTo.bind(this, each, topics.DKG_RECEIVE_SHARE))
      }
      logger.log('Added to whitelist', peerIds.map(_ => `${_.slice(0, 4)}..${_.slice(-3)}`).join(', '))
      events.emit(NODE_STATE_CHANGED)
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
      case topics.SIGNATURE_START: return this.onSignatureStart(peerId, message)
      case topics.SIGNATURE_RECEIVE_SHARE: return this.onSignatureShare(message)
      case topics.DKG_START: return this.onDkgStart(message)
      case topics.DKG_RECEIVE_SHARE: return this.onDkgShare(message)
      default: logger.log('Unknown message', message)
    }
  }

  onWhitelist(peerId, peerIds) {
    this.leader === peerId ?
      this.whitelistPeers(...peerIds) :
      logger.log('ignoring whitelist from non-leader', peerId)
  }

  onWhitelistRequest(peerId) {
    return this.whitelist.canPublish ? this.sendMessageTo(peerId, topics.WHITELIST, this.whitelist.get()) : {}
  }

  async onSignatureStart(peerId, data) {
    if (this.leader === peerId) {
      const {transferHash, from} = data
      if (!this.vaults[from]) throw Error(`missing vault for chain ${from}`)
      if (await this.vaults[from].sends(transferHash)) {
        const signature = this.tss.sign(transferHash).serializeToHexStr()
        logger.log(topics.SIGNATURE_START, transferHash, signature)
        const message = {
          signature,
          signer: this.signer,
          transferHash,
        }
        await this.sendMessageTo(peerId, topics.SIGNATURE_RECEIVE_SHARE, message)
      }
    }
  }

  async onSignatureShare(message) {
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

  onDkgStart(message) { return this.tss.onDkgStart(message) }

  onDkgShare(message) { return this.tss.onDkgShare(message) }
}

class Leader {
  constructor(self) { this.self = self}
  get isLeader() { return true }

  async addLeader() {
    this.self.leader = this.self.peerId
    this.self.whitelistPeers(this.self.leader)
  }

  listenToPeerDiscovery() {
    events.on(PEER_DISCOVERY, _ => this.self.whitelistPeers(_))
  }

  async aggregateSignature(from, transferHash) {
    const {vaults, signer, aggregateSignatures, tss, config} = this.self
    if (await vaults[from].sends(transferHash)) {
      const signature = tss.sign(transferHash).serializeToHexStr()
      aggregateSignatures[transferHash] = {
        signatures: [{signer, signature}],
        transferHash,
        verified: false,
      }
      await this.fanout(topics.SIGNATURE_START, {transferHash, from})
      const interval = 10, timeout = config.timeout //fixme:config: these should come from config
      await until(() => aggregateSignatures[transferHash].verified, interval, timeout)
    }
    return aggregateSignatures[transferHash].verified ?
      G1ToNumbers(deserializeHexStrToSignature(aggregateSignatures[transferHash].groupSign)) :
      null
  }

  async publishWhitelist() {
    const {whitelist} = this.self
    whitelist.canPublish = true
    const message = whitelist.get()
    await this.fanout(topics.WHITELIST, message)
  }

  async startDKG(threshold) {
    await this.fanout(topics.DKG_START, {threshold})
    await this.self.tss.generateVectorsAndContribution(threshold)
  }

  async fanout(topic, message) {
    const {whitelist, monitor, peerId} = this.self
    const peerIds = monitor.filter(whitelist.get()).filter(_ => _ !== peerId)
    for (let each of peerIds) await this.self.sendMessageTo(each, topic, message)
  }
}

class Follower {
  constructor(self) { this.self = self}
  get isLeader() { return false }

  listenToPeerDiscovery() {}

  async addLeader() {
    this.self.leader = this.self.network.bootstrapNodes[0].split('/').pop()
    this.self.whitelistPeers(this.self.leader)
    await waitToSync([_ => this.self.peers.includes(this.self.leader)], -1, this.self.config.timeout, this.self.config.port)
    await this.self.sendMessageTo(this.self.leader, topics.WHITELIST_REQUEST, '')
  }
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
