import {affirm, logger} from '@leverj/common'
import {stubs} from '@leverj/reactor.chain/contracts'
import {SecretKey} from '@leverj/reactor.mcl'
import {JsonRpcProvider} from 'ethers'
import {Map} from 'immutable'
import {setTimeout} from 'node:timers/promises'
import {events, NODE_STATE_CHANGED} from './events.js'
import {Follower, Leader} from './leadership.js'
import {NetworkNode} from './NetworkNode.js'
import {topics} from './topics.js'
import {TssNode} from './TssNode.js'

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
    await this.leadership.start()
    events.emit(NODE_STATE_CHANGED)
    this.ping()
  }

  async stop() {
    await this.leadership.stop()
    await this.network.stop()
  }

  async connect(peerId) { return this.network.connect(peerId) }

  async ping() {
    const timeout = this.config.messaging.timeout
    for (let peerId of this.whitelist.get()) if (peerId !== this.peerId) {
      this.monitor.updateLatency(peerId, await this.network.ping(peerId))
      await setTimeout(timeout)
    }
    setTimeout(timeout).then(_ => this.ping())
  }

  whitelistPeers(...peerIds) {
    if (peerIds.length > 0) {
      for (let each of peerIds) {
        const dkgId = this.whitelist.add(each)
        if (each !== this.peerId) this.tss.addMember(dkgId, _ => this.sendMessageTo(each, topics.DKG_RECEIVE_SHARE, _))
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
    if (!await vaults.get(BigInt(from)).sends(transferHash)) return logger.error(`unable to confirm vault on chain ${from} has a send for ${transferHash}`)
    const signature = tss.sign(transferHash).serializeToHexStr()
    logger.log(topics.SIGNATURE_START, transferHash, signature)
    await this.sendMessageTo(peerId, topics.SIGNATURE_RECEIVE_SHARE, {signature, signer, transferHash})
  }

  async onSignatureShare(message) { return this.leadership.onSignatureShare(message) }

  onDkgStart(message) { this.tss.onDkgStart(message) }

  onDkgShare(message) { this.tss.onDkgShare(message) }
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
